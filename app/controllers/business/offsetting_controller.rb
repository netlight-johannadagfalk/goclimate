# frozen_string_literal: true

module Business
  class OffsettingController < ApplicationController
    def show
      @cost_per_tonne = GreenhouseGases.new(1_000).business_price(current_region.currency).amount
      @contact = BusinessContact.new
    end
  end
end
