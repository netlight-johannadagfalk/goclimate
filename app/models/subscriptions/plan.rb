# frozen_string_literal: true

module Subscriptions
  class Plan
    BUFFER_FACTOR = 2

    attr_accessor :footprint, :price, :monthly_offset

    def self.from_stripe_plan(stripe_plan)
      monthly_offset = GreenhouseGases.from_consumer_price(stripe_plan.monthly_amount)

      new(
        monthly_offset * 12 / BUFFER_FACTOR,
        stripe_plan.monthly_amount,
        monthly_offset,
        stripe_plan
      )
    end

    def self.for_footprint(footprint, currency)
      monthly_offset = footprint / 12 * BUFFER_FACTOR

      new(
        footprint,
        monthly_offset.consumer_price(currency).small_amount_price_ceil,
        monthly_offset
      )
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
        "climate_offset_#{price.amount.to_s.gsub(/[.,]/, '_')}_#{price.currency.iso_code}_monthly"
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
        product: { name: "Climate Offset #{price.amount} #{price.currency.iso_code} Monthly" }
      }
    end
  end
end
