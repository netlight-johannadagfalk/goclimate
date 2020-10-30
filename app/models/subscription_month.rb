# frozen_string_literal: true

class SubscriptionMonth < ApplicationRecord
  belongs_to :user
  belongs_to :payment, polymorphic: true

  attribute :co2e, :greenhouse_gases
  attribute :currency, :currency

  validates_presence_of :start_at, :co2e
  validates :payment_type, inclusion: { in: %w[CardCharge ReferralCode] }

  def self.create_from_stripe_invoice_line!(stripe_invoice_line, charge)
    create!(
      price: stripe_invoice_line.amount,
      currency: stripe_invoice_line.currency,
      start_at: Time.at(stripe_invoice_line.period.start),
      co2e: GreenhouseGases.from_consumer_price(
        Money.new(stripe_invoice_line.amount, stripe_invoice_line.currency.to_sym)
      ),
      payment: charge,
      user: charge.user
    )
  end
end
