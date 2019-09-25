# frozen_string_literal: true

Currency = Struct.new(:iso_code) do
  # TODO: switch this to from_region when we have region as part of the url
  def self.from_locale(locale)
    case locale
    when :sv then Currency::SEK
    when :us then Currency::USD
    when :de then Currency::EUR
    else Currency::USD
    end
  end

  def self.from_iso_code(iso_code)
    "Currency::#{iso_code.upcase}".constantize
  rescue NameError
    nil
  end
end

Currency::SEK = Currency.new(:sek)
Currency::EUR = Currency.new(:eur)
Currency::USD = Currency.new(:usd)
