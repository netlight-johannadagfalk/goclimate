# frozen_string_literal: true

class CardCharge < ApplicationRecord
  belongs_to :user, primary_key: 'stripe_customer_id', foreign_key: 'stripe_customer_id', required: false

  scope :paid, -> { where(paid: true) }
  scope :for_subscriptions, -> { where(gift_card: false, flight_offset: false) }
  scope :for_gift_cards, -> { where(gift_card: true) }
  scope :for_flight_offsets, -> { where(flight_offset: true) }
  scope :in_sek, -> { where(currency: 'sek') }
  scope :in_usd, -> { where(currency: 'usd') }
  scope :in_eur, -> { where(currency: 'eur') }

  def self.create_from_stripe_charge(charge)
    create(
      stripe_charge_id: charge.id,
      stripe_customer_id: charge.customer,
      amount: charge.amount,
      paid: charge.paid,
      currency: charge.currency,
      gift_card: charge.description&.include?('Gift Card') || false,
      flight_offset: charge.description&.include?('Flight offset') || false,
      description: charge.description
    )
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

  def order_id
    "GCN-MONTHLY-#{id}"
  end
end
