# frozen_string_literal: true

class GreenhouseGases
  include Comparable

  CONSUMER_PRICE_PER_TONNE = {
    Currency::AUD => Money.new(6_40, :aud),
    Currency::CAD => Money.new(6_15, :cad),
    Currency::DKK => Money.new(30_00, :dkk),
    Currency::EUR => Money.new(4_00, :eur),
    Currency::GBP => Money.new(3_60, :gbp),
    Currency::SEK => Money.new(40_00, :sek),
    Currency::USD => Money.new(4_70, :usd)
  }.freeze

  BUSINESS_PRICE_PER_TONNE = {
    Currency::AUD => Money.new(8_80, :aud),
    Currency::CAD => Money.new(8_45, :cad),
    Currency::DKK => Money.new(40_50, :dkk),
    Currency::EUR => Money.new(5_50, :eur),
    Currency::GBP => Money.new(4_85, :gbp),
    Currency::SEK => Money.new(55_00, :sek),
    Currency::USD => Money.new(6_50, :usd)
  }.freeze

  attr_reader :co2e

  # This functionality should be considered deprecated--the future is that we
  # save amount of co2e sold when we sell it so we don't have to second guess
  # after the fact.
  def self.from_consumer_price(price)
    new(
      (price.subunit_amount.to_d / CONSUMER_PRICE_PER_TONNE[price.currency].subunit_amount * 1000).ceil
    )
  end

  def initialize(co2e)
    raise ArgumentError, 'co2e must be an Integer' unless co2e.is_a?(Integer)

    @co2e = co2e
  end

  def tonnes
    BigDecimal(co2e) / 1000
  end

  def consumer_price(currency)
    (CONSUMER_PRICE_PER_TONNE[currency] * tonnes).ceil
  end

  def business_price(currency)
    (BUSINESS_PRICE_PER_TONNE[currency] * tonnes).ceil
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
