# frozen_string_literal: true

require 'gift_cards_checkout'

class StripeEvent < ApplicationRecord
  belongs_to :user, primary_key: 'stripe_customer_id', foreign_key: 'stripe_customer_id', required: false

  scope :payments, ->(user = nil) { where(stripe_object: 'charge').where(stripe_customer_id: user.stripe_customer_id) }

  def self.total_payments_usd_part
    StripeEvent.where(stripe_object: 'charge').where(paid: true).where(currency: 'usd').sum('stripe_amount').to_i / 100
  end

  def self.total_payments_sek_part
    StripeEvent.where(stripe_object: 'charge').where(paid: true).where(currency: 'sek').sum('stripe_amount').to_i / 100
  end

  def self.total_payments_eur_part
    StripeEvent.where(stripe_object: 'charge').where(paid: true).where(currency: 'eur').sum('stripe_amount').to_i / 100
  end

  def self.total_in_sek
    (total_payments_sek_part +
      total_payments_usd_part * LifestyleChoice::SEK_PER_USD +
      total_payments_eur_part * LifestyleChoice::SEK_PER_EUR).round
  end

  def self.update_events
    require 'stripe'
    Stripe.api_key = ENV['SECRET_KEY']

    list = Stripe::Event.list(limit: 1000)

    list['data'].each do |e|
      event_object = e.data.object

      paid_charge = event_object.object == 'charge' && event_object.paid == true
      failed_charge = event_object.object == 'charge' && event_object.paid == false
      new_stripe_charge = (paid_charge || failed_charge) && StripeEvent.where(stripe_event_id: event_object.id).empty?

      next unless new_stripe_charge

      gift_card = event_object.description.present? &&
                  event_object.description.include?(GiftCardsCheckout::STRIPE_DESCRIPTION_BASE)

      StripeEvent.create(
        stripe_event_id: event_object.id,
        stripe_customer_id: event_object.customer,
        stripe_object: event_object.object,
        stripe_amount: event_object.amount,
        paid: event_object.paid,
        currency: event_object.currency,
        stripe_created: event_object.created,
        gift_card: gift_card,
        description: event_object.description
      )

      user = User.find_by_stripe_customer_id(event_object.customer)

      next if gift_card
      next if event_object.customer.nil?
      next if user.nil?

      if paid_charge
        number_of_payments = StripeEvent.payments(user).where(paid: true).count
        if number_of_payments % 12 == 0
          SubscriptionMailer.with(email: user.email).one_more_year_email.deliver_now
        else
          SubscriptionMailer.with(email: user.email).one_more_month_email.deliver_now
        end
      elsif failed_charge
        SubscriptionMailer.with(email: user.email).payment_failed_email.deliver_now
      end
    end
  end
end
