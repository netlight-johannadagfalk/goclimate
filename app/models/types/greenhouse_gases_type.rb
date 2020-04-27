# frozen_string_literal: true

class GreenhouseGasesType < ActiveRecord::Type::Value
  def cast(value)
    return value if value.is_a?(GreenhouseGases)

    GreenhouseGases.new(value.to_i) if value.present?
  end

  def serialize(greenhouse_gases)
    greenhouse_gases&.co2e
  end
end
