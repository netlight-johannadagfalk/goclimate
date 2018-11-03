# frozen_string_literal: true

class StripeEvent < ApplicationRecord
  belongs_to :user, class_name: 'User', primary_key: 'stripe_customer_id', foreign_key: 'stripe_customer_id', required: false

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

      next unless (paid_charge || failed_charge) && StripeEvent.where(stripe_event_id: event_object.id).empty?

      # if we find a new stripe event with the stripe_customer_id not belonging to one of our users, we assume it is from a gift card
      gift_card = event_object.customer.nil? || User.find_by_stripe_customer_id(event_object.customer).nil?

      StripeEvent.create(
        stripe_event_id: event_object.id,
        stripe_customer_id: event_object.customer,
        stripe_object: event_object.object,
        stripe_amount: event_object.amount,
        paid: event_object.paid,
        currency: event_object.currency,
        stripe_created: event_object.created,
        gift_card: gift_card
      )

      next if gift_card

      u = User.find_by_stripe_customer_id(event_object.customer)

      if paid_charge
        number_of_payments = StripeEvent.payments(u).where(paid: true).count
        if number_of_payments % 12 == 0
          SubscriptionMailer.with(email: u.email).one_more_year_email.deliver_now
        else
          SubscriptionMailer.with(email: u.email).one_more_month_email.deliver_now
        end
      elsif failed_charge
        SubscriptionMailer.with(email: u.email).payment_failed_email.deliver_now
      end
    end
  end
end
