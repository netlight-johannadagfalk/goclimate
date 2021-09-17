# frozen_string_literal: true

require 'securerandom'

class FlightOffset < ApplicationRecord
  class InvalidPaymentIntentError < StandardError; end

  attribute :currency, :currency
  attribute :co2e, :greenhouse_gases

  validates :key, uniqueness: true, format: { with: /\A[a-f0-9]{40}\z/ }
  validates :email, email: true
  validates_presence_of :co2e, :price, :currency, :email

  after_initialize :set_price_if_unset
  before_validation :generate_key

  def create_payment_intent
    return payment_intent if payment_intent.present?

    @payment_intent = Stripe::PaymentIntent.create(
      amount: price.subunit_amount,
      currency: currency.iso_code,
      description: 'Flight offset',
      metadata: { checkout_object: 'flight_offset' }
    )

    self.payment_intent_id = @payment_intent.id

    @payment_intent
  end

  def finalize
    return true if paid_at.present?
    return false unless payment_intent&.status == 'succeeded'

    update(paid_at: Time.now)
    send_confirmation_email
    true
  end

  def send_confirmation_email
    FlightOffsetMailer.with(
      flight_offset: self,
      certificate_pdf: FlightOffsetCertificatePdf.new(self).render
    ).flight_offset_email.deliver_now
  end

  def update_from_payment_intent(payment_intent)
    @payment_intent = payment_intent

    case @payment_intent.status
    when 'succeeded'
      finalize
    end
  end

  def to_param
    key
  end

  def order_id
    "GCN-FLIGHT-#{id}"
  end

  def payment_intent
    return nil if @payment_intent.nil? && payment_intent_id.nil?

    @payment_intent ||= Stripe::PaymentIntent.retrieve(payment_intent_id)

    unless @payment_intent.amount == price.subunit_amount && @payment_intent.currency == currency.iso_code.to_s
      raise InvalidPaymentIntentError
    end

    @payment_intent
  end

  def price
    value = super
    Money.new(value, currency) if value.present?
  end

  def price=(price)
    if price.is_a?(Money)
      self.currency = price.currency
      super(price.subunit_amount)
      return
    end

    super(price)
  end

  def infer_user_id
    User.find_by_email(email)&.id
  end

  private

  def set_price_if_unset
    self.price ||= co2e.consumer_price(currency) if co2e.present? && currency.present?
  end

  def generate_key
    self.key = SecureRandom.hex(20) unless key.present?
  end
end
