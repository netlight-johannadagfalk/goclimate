# frozen_string_literal: true

class AllowedUnitsType < ActiveRecord::Type::Json
  def cast(value)
    return value.filter(&:present?).map { |v| [v, ''] }.to_h if value.is_a?(Array)

    value
  end
end
