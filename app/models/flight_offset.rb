# frozen_string_literal: true

require 'securerandom'

class FlightOffset < ApplicationRecord
  class InvalidPaymentIntentError < StandardError; end

  include HasMoneyAttributes

  attribute :currency, :currency
  attribute :co2e, :greenhouse_gases
  money_attribute :price, :currency
  money_attribute :vat_amount, :currency
  money_attribute :price_incl_taxes, :currency

  validates :key, uniqueness: true, format: { with: /\A[a-f0-9]{40}\z/ }
  validates :email, email: true
  validates_presence_of :co2e, :price_incl_taxes, :price, :vat_amount, :currency, :email

  after_initialize :set_price_if_unset
  after_initialize :set_subtotals
  before_validation :generate_key

  def create_payment_intent
    return payment_intent if payment_intent.present?

    @payment_intent = Stripe::PaymentIntent.create(
      amount: price_incl_taxes.subunit_amount,
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

    unless @payment_intent.amount == price_incl_taxes.subunit_amount &&
           @payment_intent.currency == currency.iso_code.to_s
      raise InvalidPaymentIntentError
    end

    @payment_intent
  end

  def infer_user_id
    User.find_by_email(email)&.id
  end

  private

  def set_price_if_unset
    self.price_incl_taxes ||= co2e.consumer_price(currency) if co2e.present? && currency.present?
  end

  def set_subtotals
    return unless new_record? && price_incl_taxes.present?

    self.price = price_incl_taxes / BigDecimal('1.25')
    self.vat_amount = price_incl_taxes - price
  end

  def generate_key
    self.key = SecureRandom.hex(20) unless key.present?
  end
end
