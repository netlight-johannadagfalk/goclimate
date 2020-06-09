# frozen_string_literal: true

require 'digest'

class GiftCard < ApplicationRecord # rubocop:todo Metrics/ClassLength
  class InvalidPaymentIntent < StandardError; end

  attribute :currency, :currency
  attribute :co2e, :greenhouse_gases

  validates :key, uniqueness: true, format: { with: /\A[a-f0-9]{40}\z/ }
  validates :customer_email, email: true
  validates_presence_of :key, :number_of_months, :price, :currency, :customer_email, :co2e
  # Allow checking validation with payment_intent_id ignored, e.g. valid?(:without_payment_intent_id)
  validates_presence_of :payment_intent_id, on: [:create, :update]

  after_initialize :set_co2e_and_price_if_new
  before_validation :generate_key

  def create_payment_intent
    return payment_intent if payment_intent.present?

    @payment_intent = Stripe::PaymentIntent.create(
      amount: price.subunit_amount,
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
    pdf = GiftCardCertificatePdf.from_gift_card(self).render

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

    unless @payment_intent.amount == price.subunit_amount && @payment_intent.currency == currency.iso_code.to_s
      raise InvalidPaymentIntent
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

  def to_param
    key
  end

  private

  def calculate_co2e
    # Average for Sweden * buffer / 12 months per year * number of months
    tonnes = 11.0 * 2 / 12 * number_of_months
    GreenhouseGases.new((tonnes * 1000).round)
  end

  def calculate_current_price
    Money.from_amount((price_per_month * number_of_months).to_i, currency)
  end

  def price_per_month
    avg_tonnes_per_year = BigDecimal(11) # Average tonnes co2 per person and year
    months_per_year = 12
    buffer = 2
    total = avg_tonnes_per_year * price_per_tonne / months_per_year * buffer
    should_be_rounded ? total.round : total
  end

  # This method should be removed, and all currencies be rounded after the
  # multiplication with number_of_months, but since that gives different
  # giftCard amounts we cannot do it until we start saving what price a customer
  # paid for their gift_card.
  def should_be_rounded
    currency != Currency::SEK
  end

  def price_per_tonne
    sek_per_currency = case currency
                       when Currency::USD
                         GreenhouseGases::PRICE_FACTOR_USD
                       when Currency::EUR
                         GreenhouseGases::PRICE_FACTOR_EUR
                       else
                         1
                       end
    GreenhouseGases::CONSUMER_PRICE_PER_TONNE_SEK.amount.to_i / sek_per_currency
  end

  def set_co2e_and_price_if_new
    return unless new_record? && number_of_months.present?

    self.co2e ||= calculate_co2e
    self.price ||= calculate_current_price if currency.present?
  end

  def generate_key
    self.key = SecureRandom.hex(20) unless key.present?
  end
end
