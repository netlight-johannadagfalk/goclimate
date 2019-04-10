# frozen_string_literal: true

class FlightOffsetCheckout
  attr_reader :source, :amount, :currency, :errors

  def initialize(source, amount, currency)
    @source = source
    @amount = amount
    @currency = currency&.downcase
    @errors = {}
  end

  def checkout
    charge
    true
  rescue Stripe::CardError => error
    errors[error.code.to_sym] = error.message
    false
  end

  private

  def charge
    Stripe::Charge.create(
      source: @source,
      amount: @amount,
      currency: @currency,
      description: 'Flight offset'
    )
  end
end
