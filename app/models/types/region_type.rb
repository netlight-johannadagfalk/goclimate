# frozen_string_literal: true

class RegionType < ActiveRecord::Type::Value
  def cast(value)
    return value if value.is_a?(Region)

    Region.find(value)
  end

  def serialize(region)
    region&.id
  end
end
