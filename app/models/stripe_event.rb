# frozen_string_literal: true

require 'gift_cards_checkout'
require 'stripe_events_consumer'

class StripeEvent < ApplicationRecord
  belongs_to :user, primary_key: 'stripe_customer_id', foreign_key: 'stripe_customer_id', required: false

  scope :payments, ->(user = nil) { where(stripe_object: 'charge').where(stripe_customer_id: user.stripe_customer_id) }

  def self.create_from_stripe_charge(charge, gift_card = false)
    create(
      stripe_event_id: charge.id,
      stripe_customer_id: charge.customer,
      stripe_object: charge.object,
      stripe_amount: charge.amount,
      paid: charge.paid,
      currency: charge.currency,
      stripe_created: charge.created,
      gift_card: gift_card,
      description: charge.description
    )
  end

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
    StripeEventsConsumer.new.fetch_and_process
  end
end
