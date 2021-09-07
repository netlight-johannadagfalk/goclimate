# frozen_string_literal: true

module Subscriptions
  class SubscriptionMonth < ApplicationRecord
    include HasMoneyAttributes

    belongs_to :user
    belongs_to :payment, polymorphic: true

    attribute :co2e, :greenhouse_gases
    attribute :currency, :currency
    money_attribute :price, :currency

    validates_presence_of :start_at, :co2e
    validates :payment_type, inclusion: { in: %w[CardCharge Subscriptions::ReferralCode] }

    def self.create_from_stripe_invoice_line!(stripe_invoice_line, charge)
      create!(
        price: stripe_invoice_line.amount,
        currency: stripe_invoice_line.currency,
        start_at: Time.at(stripe_invoice_line.period.start),
        co2e:
          # Plans used from June 2021 include the co2e amount offset for each
          # month as metadata. Previous payments were calculated by reversing the
          # amount chaged, so for those we keep the 2017 pricelist.
          if (co2e = stripe_invoice_line.price.metadata['co2e']).present?
            GreenhouseGases.new(co2e.to_i)
          else
            GreenhouseGases.from_2017_consumer_price(
              Money.new(stripe_invoice_line.amount, stripe_invoice_line.currency.to_sym)
            )
          end,
        payment: charge,
        user: charge.user
      )
    end
  end
end
