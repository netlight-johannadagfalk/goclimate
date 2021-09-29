# frozen_string_literal: true

class GreenhouseGases
  include Comparable

  # Consumer prices are inclusive of 25% Swedish VAT.
  CONSUMER_PRICE_PER_TONNE = {
    Currency::AUD => Money.new(9_50, :aud),
    Currency::CAD => Money.new(8_80, :cad),
    Currency::DKK => Money.new(44_00, :dkk),
    Currency::EUR => Money.new(6_00, :eur),
    Currency::GBP => Money.new(5_00, :gbp),
    Currency::SEK => Money.new(60_00, :sek),
    Currency::USD => Money.new(7_00, :usd)
  }.freeze

  CONSUMER_PRICE_PER_TONNE_2017 = {
    Currency::AUD => Money.new(6_40, :aud),
    Currency::CAD => Money.new(6_15, :cad),
    Currency::DKK => Money.new(30_00, :dkk),
    Currency::EUR => Money.new(4_00, :eur),
    Currency::GBP => Money.new(3_60, :gbp),
    Currency::SEK => Money.new(40_00, :sek),
    Currency::USD => Money.new(4_70, :usd)
  }.freeze

  # Business prices are exclusive of any taxes.
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

  def self.from_2017_consumer_price(price)
    new(
      (price.subunit_amount.to_d / CONSUMER_PRICE_PER_TONNE_2017[price.currency].subunit_amount * 1000).ceil
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

  def to_s(unit: :kgs, precision: nil)
    case unit
    when :kgs
      I18n.translate(
        'models.greenhouse_gases.kg',
        count: co2e,
        formatted_count: ActiveSupport::NumberHelper.number_to_delimited(co2e)
      )
    when :tonnes
      precision ||= co2e < 100 ? 2 : 1
      rounded_tonnes = tonnes.round(precision)

      I18n.translate(
        'models.greenhouse_gases.tonnes',
        count: rounded_tonnes,
        formatted_count: ActiveSupport::NumberHelper.number_to_rounded(
          rounded_tonnes,
          # Default delimiter for number_to_rounded is no delimiter, so we need to pass the locale delimiter explicitly
          delimiter: I18n.translate(:'number.format.delimiter'),
          precision: precision
        )
      )
    end
  end

  def inspect
    I18n.with_locale(:en) { to_s }
  end
end
