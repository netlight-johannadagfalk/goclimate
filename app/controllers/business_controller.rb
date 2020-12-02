# frozen_string_literal: true

class BusinessController < ApplicationController
  def show
    @cost_per_tonne = GreenhouseGases.new(1_000).business_price(current_region.currency).amount
  end
end
