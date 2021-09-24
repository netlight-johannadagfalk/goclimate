# frozen_string_literal: true

require 'digest'

class GiftCard < ApplicationRecord
  class InvalidPaymentIntent < StandardError; end

  include HasMoneyAttributes

  attribute :currency, :currency
  attribute :co2e, :greenhouse_gases
  attribute :yearly_footprint, :greenhouse_gases
  attribute :country, :country
  money_attribute :price, :currency
  money_attribute :vat_amount, :currency
  money_attribute :price_incl_taxes, :currency

  validates :key, uniqueness: true, format: { with: /\A[a-f0-9]{40}\z/ }
  validates :customer_email, email: true
  validates_presence_of :key, :number_of_months, :price_incl_taxes, :price, :vat_amount, :currency, :customer_email,
                        :co2e
  # Allow checking validation with payment_intent_id ignored, e.g. valid?(:without_payment_intent_id)
  validates_presence_of :payment_intent_id, on: [:create, :update]
  validate :country_average_exists

  after_initialize :set_co2e_and_price_if_new
  after_initialize :set_subtotals
  before_validation :generate_key

  def create_payment_intent
    return payment_intent if payment_intent.present?

    @payment_intent = Stripe::PaymentIntent.create(
      amount: price_incl_taxes.subunit_amount,
      currency: currency.iso_code,
      description: "Gift Card #{number_of_months} months",
      metadata: { checkout_object: 'gift_card' }
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
    pdf = GiftCardCertificatePdf.new(self).render

    GiftCardMailer.with(
      email: customer_email,
      number_of_months: number_of_months,
      gift_card_pdf: pdf
    ).gift_card_email.deliver_now
  end

  def update_from_payment_intent(payment_intent)
    @payment_intent = payment_intent

    case @payment_intent.status
    when 'succeeded'
      finalize
    end
  end

  def order_id
    "GCN-GIFT-#{id}"
  end

  def payment_intent
    return nil if @payment_intent.nil? && payment_intent_id.nil?

    @payment_intent ||= Stripe::PaymentIntent.retrieve(payment_intent_id)

    unless @payment_intent.amount == price_incl_taxes.subunit_amount &&
           @payment_intent.currency == currency.iso_code.to_s
      raise InvalidPaymentIntent
    end

    @payment_intent
  end

  def to_param
    key
  end

  # TODO: During migrations, price means price_incl_taxes if
  # price_incl_taxes is null. Remove once all data has been migrated.
  def price_incl_taxes
    super || price
  end

  private

  def set_co2e_and_price_if_new
    return unless new_record?

    self.yearly_footprint = LifestyleFootprintAverage.find_by_country(country).co2e
    self.co2e ||= calculate_co2e if number_of_months.present?
    self.price_incl_taxes ||= calculate_price if co2e.present? && currency.present?
  end

  def set_subtotals
    return unless new_record? && price_incl_taxes.present?

    self.price = price_incl_taxes / BigDecimal('1.25')
    self.vat_amount = price_incl_taxes - price
  end

  def calculate_co2e
    # Average yearly footprint * buffer / 12 months per year * number of months
    GreenhouseGases.new((yearly_footprint.co2e.to_d * 2 / 12 * number_of_months).round)
  end

  def calculate_price
    co2e.consumer_price(currency).large_amount_price_ceil
  end

  def generate_key
    self.key = SecureRandom.hex(20) unless key.present?
  end

  def country_average_exists
    return if LifestyleFootprintAverage::COUNTRIES_AVAILABLE.include?(country)

    errors.add(:country, 'must be one we have average footprint for')
  end
end
