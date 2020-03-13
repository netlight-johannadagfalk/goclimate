# frozen_string_literal: true

class GreenhouseGases
  include Comparable

  CONSUMER_PRICE_PER_TONNE_SEK = Money.new(40_00, :sek)
  PRICE_FACTOR_USD = 8.5
  PRICE_FACTOR_EUR = 10

  attr_reader :co2e

  def initialize(co2e)
    raise ArgumentError, 'co2e must be an Integer' unless co2e.is_a?(Integer)

    @co2e = co2e
  end

  def tonnes
    BigDecimal(co2e) / 1000
  end

  def consumer_price(currency)
    case currency
    when Currency::SEK
      (CONSUMER_PRICE_PER_TONNE_SEK * tonnes).ceil
    when Currency::USD
      amount = (
        CONSUMER_PRICE_PER_TONNE_SEK.subunit_amount / PRICE_FACTOR_USD * tonnes
      ).round(-1).to_i

      Money.new(amount, :usd)
    when Currency::EUR
      amount = (
        CONSUMER_PRICE_PER_TONNE_SEK.subunit_amount / PRICE_FACTOR_EUR * tonnes
      ).round(-1).to_i

      Money.new(amount, :eur)
    end
  end

  def <=>(other)
    co2e <=> other.co2e
  end

  def *(other)
    GreenhouseGases.new(co2e * other)
  end

  def /(other)
    GreenhouseGases.new(co2e / other)
  end

  def +(other)
    GreenhouseGases.new(co2e + other.co2e)
  end

  def -(other)
    GreenhouseGases.new(co2e - other.co2e)
  end

  def to_s(options = {})
    if options[:precision] == :auto
      rounded_tonnes = (BigDecimal(co2e) / 1000).round(co2e < 100 ? 2 : 1)

      return I18n.translate('models.greenhouse_gases.tonnes', count: rounded_tonnes)
    end

    if co2e % 1000 == 0
      I18n.translate('models.greenhouse_gases.tonnes', count: co2e / 1000)
    else
      I18n.translate('models.greenhouse_gases.kg', count: co2e)
    end
  end

  def inspect
    I18n.with_locale(:en) { to_s }
  end
end
