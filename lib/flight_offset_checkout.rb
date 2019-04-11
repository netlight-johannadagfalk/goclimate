# frozen_string_literal: true

class FlightOffsetCheckout
  attr_reader :source, :amount, :currency, :errors, :charge

  def initialize(source, amount, currency)
    @source = source
    @amount = amount
    @currency = currency&.downcase
    @errors = {}
  end

  def checkout
    perform_charge
    true
  rescue Stripe::CardError => error
    errors[error.code.to_sym] = error.message
    false
  end

  private

  def perform_charge
    @charge = Stripe::Charge.create(
      source: @source,
      amount: @amount,
      currency: @currency,
      description: 'Flight offset'
    )
  end
end
