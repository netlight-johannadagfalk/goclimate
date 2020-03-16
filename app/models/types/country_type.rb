# frozen_string_literal: true

class CountryType < ActiveRecord::Type::Value
  def cast(value)
    ISO3166::Country.new(value)
  end

  def serialize(country)
    country = country.alpha2 if country.is_a?(ISO3166::Country)

    country.downcase
  end
end
