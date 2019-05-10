# frozen_string_literal: true

class CountryValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    return if value.nil? || ISO3166::Country.new(value).present?

    record.errors[attribute] << (options[:message] || 'is not a country')
  end
end
