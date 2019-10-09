# frozen_string_literal: true

class CurrencyType < ActiveRecord::Type::Value
  def cast(value)
    return value if value.is_a?(Currency)

    Currency.from_iso_code(value&.downcase)
  end

  def serialize(currency)
    currency&.iso_code&.to_s
  end
end
