# frozen_string_literal: true

##
# Adds the +money_attribute+ class method to a model class. This helper creates
# accessor methods for an attribute of money type, translating between +Money+
# objects and +ActiveRecord+ types.
#
# Defined attributes are added to an anonymous module to allow the class to
# overwrite methods with further functionality.
module HasMoneyAttributes
  extend ActiveSupport::Concern

  class CurrencyMismatchError < StandardError; end

  included do
    @money_methods_module = Module.new
    include @money_methods_module

    ##
    # Defines a money attribute the currency of a provided currency attribute of the model.
    #
    # +attribute+  The attribute to overwrite as a money attribute.
    #
    # +currency_attribute+ The name of the attribute holding the currency to be
    # used for this money attribute.
    def self.money_attribute(attribute, currency_attribute)
      @money_methods_module.define_method(attribute) do
        Money.new(super(), send(currency_attribute)) if super().present?
      end

      @money_methods_module.define_method("#{attribute}=") do |value|
        return super(value) unless value.is_a?(Money)

        send("#{currency_attribute}=", value.currency) if send(currency_attribute).nil?
        raise CurrencyMismatchError, <<~TEXT unless value.currency == send(currency_attribute)
          New value #{value} for #{attribute} must match #{currency_attribute} (#{currency})
        TEXT

        super(value.subunit_amount)
      end
    end
  end
end
