# frozen_string_literal: true

# Note that while this class is named `StripeEvent`, its attributes, usage and
# behavior really only relates to charges in Stripe. It should be thought of as
# if it was named `StripeCharge`.

class StripeEvent < ApplicationRecord
  belongs_to :user, primary_key: 'stripe_customer_id', foreign_key: 'stripe_customer_id', required: false

  scope :payments, ->(user = nil) { where(stripe_object: 'charge').where(stripe_customer_id: user.stripe_customer_id) }
  scope :paid_charges, -> { where(stripe_object: 'charge', paid: true) }
  scope :for_subscriptions, -> { where(gift_card: false, flight_offset: false) }
  scope :for_gift_cards, -> { where(gift_card: true) }
  scope :for_flight_offsets, -> { where(flight_offset: true) }
  scope :in_sek, -> { where(currency: 'sek') }
  scope :in_usd, -> { where(currency: 'usd') }
  scope :in_eur, -> { where(currency: 'eur') }

  def self.create_from_stripe_charge(charge)
    create(
      stripe_event_id: charge.id,
      stripe_customer_id: charge.customer,
      stripe_object: charge.object,
      stripe_amount: charge.amount,
      paid: charge.paid,
      currency: charge.currency,
      # FIXME: The following stripe_created setter has never worked as
      # charge.created is an integer while ActiveRecord expects a Time. Since
      # it could never have been used best is probably to remove it.
      stripe_created: charge.created,
      gift_card: charge.description&.include?(GiftCardsCheckout::STRIPE_DESCRIPTION_BASE) || false,
      flight_offset: charge.description&.include?(FlightOffsetCheckout::STRIPE_DESCRIPTION) || false,
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

  def order_id
    "GCN-SE-#{id}"
  end
end
