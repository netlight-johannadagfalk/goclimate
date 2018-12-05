# frozen_string_literal: true

class SubscriptionMonthsGiftCard
  PRICE_PER_MONTH =
    BigDecimal(11) * LifestyleChoice::SEK_PER_TONNE / 12 * 2

  attr_reader :number_of_months, :currency, :recipient, :message
  attr_writer :recipient, :message

  def initialize(number_of_months, currency)
    @number_of_months = number_of_months
    @currency = currency
  end

  def price
    if @currency == 'sek'
      (PRICE_PER_MONTH * @number_of_months).to_i
    elsif @currency == 'usd'
      ((PRICE_PER_MONTH / LifestyleChoice::SEK_PER_USD).round * @number_of_months).to_i
    else
      ((PRICE_PER_MONTH / LifestyleChoice::SEK_PER_EUR).round * @number_of_months).to_i
    end
  end
end
