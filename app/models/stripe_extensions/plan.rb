# frozen_string_literal: true

module StripeExtensions
  module Plan
    def self.included(base)
      base.extend(ClassMethods)
    end

    module ClassMethods
      def retrieve_or_create_climate_offset_plan(monthly_amount, currency)
        retrieve(plan_id(monthly_amount, currency))
      rescue ::Stripe::InvalidRequestError
        create(climate_offset_plan_params(monthly_amount, currency))
      end

      private

      def climate_offset_plan_params(monthly_amount, currency)
        {
          id: plan_id(monthly_amount, currency),
          interval: 'month',
          currency: currency,
          amount: (monthly_amount.to_f * 100).round,
          product: { name: product_name(monthly_amount, currency) }
        }
      end

      def plan_id(monthly_amount, currency)
        "climate_offset_#{monthly_amount.to_s.gsub(/[.,]/, '_')}_#{currency}_monthly"
      end

      def product_name(monthly_amount, currency)
        "Climate Offset #{monthly_amount} #{currency} Monthly"
      end
    end
  end
end

Stripe::Plan.include(StripeExtensions::Plan)
