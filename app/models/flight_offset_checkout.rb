# frozen_string_literal: true

class FlightOffsetCheckout
  STRIPE_DESCRIPTION = 'Flight offset'

  attr_reader :payment_intent, :amount, :co2e, :email, :errors, :charge, :offset

  def initialize(attributes = {})
    @payment_intent = attributes[:payment_intent]
    @amount = attributes[:amount]
    @co2e = attributes[:co2e]
    @email = attributes[:email]
    @errors = {}
  end

  def checkout
    create_flight_offset_record
    send_confirmation_email
    true
  end

  private

  def create_flight_offset_record
    @offset = FlightOffset.create!(
      charged_money: amount,
      stripe_charge_id: payment_intent.charges.first.id,
      co2e: co2e,
      email: email
    )
  end

  def send_confirmation_email
    FlightOffsetMailer.with(
      flight_offset: @offset,
      certificate_pdf: FlightOffsetCertificatePdf.new(@offset).render
    ).flight_offset_email.deliver_now
  end
end
