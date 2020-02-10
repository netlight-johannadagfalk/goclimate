# frozen_string_literal: true

require 'digest'

class GiftCard < ApplicationRecord
  attribute :currency, :currency

  validates :key, uniqueness: true, format: { with: /\A[a-f0-9]{40}\z/ }
  validates_presence_of :number_of_months

  before_validation :generate_key

  def price
    Money.from_amount((price_per_month * number_of_months).to_i, currency)
  end

  def order_id
    "GCN-GIFT-#{id}"
  end

  def create_payment_intent
    Stripe::PaymentIntent.create(
      amount: price.subunit_amount,
      currency: currency.iso_code,
      description: "Gift Card #{number_of_months} months"
    )
  end

  def to_param
    key
  end

  private

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
                         LifestyleChoice::SEK_PER_USD
                       when Currency::EUR
                         LifestyleChoice::SEK_PER_EUR
                       else
                         1
                       end
    LifestyleChoice::SEK_PER_TONNE / sek_per_currency
  end

  def generate_key
    self.key = SecureRandom.hex(20) unless key.present?
  end
end
