# frozen_string_literal: true

# Adapted from https://guides.rubyonrails.org/active_record_validations.html#custom-validators
class EmailValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    return if value.nil? || value.match?(/\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i)

    record.errors[attribute] << (options[:message] || 'is not a valid email')
  end
end
