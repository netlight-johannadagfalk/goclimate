# frozen_string_literal: true

class SubscriptionMonthsGiftCard
  PRICE_PER_MONTH =
    BigDecimal(11) * LifestyleChoice::SEK_PER_TONNE / 12 * 2 * 100

  attr_reader :number_of_months, :currency

  def initialize(number_of_months, currency)
    @number_of_months = number_of_months
    @currency = currency
  end

  def price
    (PRICE_PER_MONTH * @number_of_months).to_i
  end
end
