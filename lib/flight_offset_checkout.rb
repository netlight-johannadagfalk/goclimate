# frozen_string_literal: true

class FlightOffsetCheckout
  STRIPE_DESCRIPTION = 'Flight offset'

  attr_reader :stripe_source, :amount, :currency, :co2e, :email, :errors, :charge, :offset

  def initialize(attributes = {})
    @stripe_source = attributes[:stripe_source]
    @amount = attributes[:amount]
    @currency = attributes[:currency]&.downcase
    @co2e = attributes[:co2e]
    @email = attributes[:email]
    @errors = {}
  end

  def checkout
    perform_charge
    create_flight_offset_record
    send_confirmation_email
    true
  rescue Stripe::CardError => error
    errors[error.code.to_sym] = error.message
    false
  end

  private

  def perform_charge
    @charge = Stripe::Charge.create(
      source: @stripe_source,
      amount: @amount,
      currency: @currency,
      description: STRIPE_DESCRIPTION
    )
  end

  def create_flight_offset_record
    @offset = FlightOffset.create!(
      charged_amount: @charge.amount,
      charged_currency: @charge.currency,
      stripe_charge_id: @charge.id,
      co2e: @co2e,
      email: @email
    )
  end

  def send_confirmation_email
    FlightOffsetMailer.with(
      flight_offset: @offset,
      certificate_pdf: FlightOffsetCertificatePDFGenerator.new(@offset).generate_pdf
    ).flight_offset_email.deliver_now
  end
end
