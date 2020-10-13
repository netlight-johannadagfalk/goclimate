# frozen_string_literal: true

class CardCharge < ApplicationRecord
  belongs_to :user, primary_key: 'stripe_customer_id', foreign_key: 'stripe_customer_id', required: false
  has_many :subscription_months, as: :payment

  scope :paid, -> { where(paid: true) }
  scope :for_subscriptions, -> { where(gift_card: false, flight_offset: false) }
  scope :for_gift_cards, -> { where(gift_card: true) }
  scope :for_flight_offsets, -> { where(flight_offset: true) }
  scope :in_sek, -> { where(currency: 'sek') }
  scope :in_usd, -> { where(currency: 'usd') }
  scope :in_eur, -> { where(currency: 'eur') }

  def self.create_from_stripe_charge(stripe_charge)
    charge = create(attributes_from_stripe_charge(stripe_charge))

    charge.send_subscription_payment_email if stripe_charge.invoice.present?

    charge
  end

  def self.total_payments_usd_part
    where(paid: true).where(currency: 'usd').sum('amount').to_i / 100
  end

  def self.total_payments_sek_part
    where(paid: true).where(currency: 'sek').sum('amount').to_i / 100
  end

  def self.total_payments_eur_part
    where(paid: true).where(currency: 'eur').sum('amount').to_i / 100
  end

  def self.total_in_sek
    (total_payments_sek_part +
      total_payments_usd_part * GreenhouseGases::PRICE_FACTOR_USD +
      total_payments_eur_part * GreenhouseGases::PRICE_FACTOR_EUR).round
  end

  def self.payments_per_month
    where(paid: true)
      .group("CONCAT((EXTRACT(YEAR FROM created_at)), '-', LPAD(EXTRACT(MONTH FROM created_at)::text, 2, '0'))")
      .group('currency')
      .order('2 DESC')
      .sum('amount / 100')
  end

  def self.co2e_per_month
    co2 = {}
    payments_per_month.each do |(month, currency), amount|
      sek_amount =
        case currency
        when 'usd'
          amount * GreenhouseGases::PRICE_FACTOR_USD
        when 'eur'
          amount * GreenhouseGases::PRICE_FACTOR_EUR
        when 'sek'
          amount
        end
      co2[month] = 0 if co2[month].nil?
      co2[month] += sek_amount / GreenhouseGases::CONSUMER_PRICE_PER_TONNE_SEK.amount
    end
    co2
  end

  def order_id
    "GCN-MONTHLY-#{id}"
  end

  def send_subscription_payment_email
    return if user.nil?

    if paid?
      send_subscription_payment_successful_email
    else
      send_subscription_payment_failed_email
    end
  end

  private_class_method def self.attributes_from_stripe_charge(stripe_charge)
    {
      stripe_charge_id: stripe_charge.id,
      stripe_customer_id: stripe_charge.customer,
      amount: stripe_charge.amount,
      paid: stripe_charge.paid,
      currency: stripe_charge.currency,
      gift_card: stripe_charge.description&.include?('Gift Card') || false,
      flight_offset: stripe_charge.description&.include?('Flight offset') || false,
      description: stripe_charge.description
    }
  end

  private

  def send_subscription_payment_successful_email
    if user.number_of_neutral_months % 12 == 0
      SubscriptionMailer.with(email: user.email).one_more_year_email.deliver_now
    else
      SubscriptionMailer.with(email: user.email).one_more_month_email.deliver_now
    end
  end

  def send_subscription_payment_failed_email
    SubscriptionMailer.with(email: user.email).payment_failed_email.deliver_now
  end
end
