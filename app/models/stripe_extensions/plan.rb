# frozen_string_literal: true

module StripeExtensions
  module Plan
    def monthly_amount
      Money.new(amount, Currency.from_iso_code(currency))
    end
  end
end

Stripe::Plan.include(StripeExtensions::Plan)
