# frozen_string_literal: true

module Subscriptions
  class Plan
    BUFFER_FACTOR = 2
    SUBSCRIPTION_PRODUCT_ID = 'offsetting_subscription_2021' # Created manually in Stripe

    attr_accessor :footprint, :price, :monthly_offset

    def self.from_stripe_plan(stripe_plan)
      monthly_offset =
        if (co2e = stripe_plan.metadata['co2e']).present?
          GreenhouseGases.new(co2e.to_i)
        else
          GreenhouseGases.from_2017_consumer_price(Money.new(stripe_plan.amount, stripe_plan.currency.to_sym))
        end

      new(
        monthly_offset * 12 / BUFFER_FACTOR,
        Money.new(stripe_plan.amount, Currency.from_iso_code(stripe_plan.currency)),
        monthly_offset,
        stripe_plan
      )
    end

    # for_footprint uses for_price to ensure that everyone paying the same
    # amount also gets offsetting credits for the same amount of co2e
    def self.for_footprint(footprint, currency)
      monthly_offset = footprint / 12 * BUFFER_FACTOR

      for_price(monthly_offset.consumer_price(currency).small_amount_price_ceil)
    end

    def self.for_price(price)
      monthly_offset = GreenhouseGases.from_consumer_price(price)

      new(
        monthly_offset * 12 / BUFFER_FACTOR,
        price,
        monthly_offset
      )
    end

    def self.available_plans(currency, current_plan)
      current_plan_price_amount = current_plan&.price&.subunit_amount || 0

      starting_plan_price = currency.small_amount_price_step * 4
      ending_plan_price = current_plan_price_amount + currency.small_amount_price_step * 60
      prices = (starting_plan_price...ending_plan_price).step(currency.small_amount_price_step).to_a

      plans = prices.map { |amount| for_price(Money.new(amount, currency)) }

      plans.push(current_plan) if current_plan.present? && plans.exclude?(current_plan)
      plans.sort { |a, b| a.price <=> b.price }
    end

    def initialize(footprint, price, monthly_offset, stripe_plan = nil)
      raise ArgumentError, 'Plans must have an amount' if price.subunit_amount == 0

      @footprint = footprint
      @price = price
      @monthly_offset = monthly_offset
      @stripe_plan = stripe_plan
    end

    def retrieve_or_create_stripe_plan
      @stripe_plan || Stripe::Plan.retrieve(stripe_plan_id)
    rescue Stripe::InvalidRequestError
      Stripe::Plan.create(stripe_plan_params)
    end

    def stripe_plan_id
      @stripe_plan&.id ||
        "#{SUBSCRIPTION_PRODUCT_ID}_#{price.currency.iso_code}_#{format('%.2f', price.amount).sub('.', '_')}"
    end

    def ==(other)
      self.class == other.class &&
        footprint == other.footprint &&
        price == other.price &&
        monthly_offset == other.monthly_offset
    end

    private

    def stripe_plan_params
      {
        id: stripe_plan_id,
        interval: 'month',
        currency: price.currency.iso_code,
        amount: price.subunit_amount,
        product: SUBSCRIPTION_PRODUCT_ID,
        metadata: {
          co2e: monthly_offset.co2e
        }
      }
    end
  end
end
