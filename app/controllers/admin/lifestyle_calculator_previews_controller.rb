# frozen_string_literal: true

module Admin
  class LifestyleCalculatorPreviewsController < ApplicationController
    def create
      calculator = LifestyleCalculator.find(params[:id])

      result = calculator.calculate(answers_from_params)

      render json: response_json(result)
    rescue StandardError => e
      render json: {
        error: e.message
      }
    end

    private

    def answers_from_params
      params.require(:answers).permit(
        :region, :home, :home_area, :heating, :green_electricity, :food, :car_type, :car_distance, :flight_hours
      ).to_h.symbolize_keys
    end

    def response_json(result)
      {
        housing: result[:housing].to_s,
        food: result[:food].to_s,
        car: result[:car].to_s,
        flights: result[:flights].to_s,
        consumption: result[:consumption].to_s,
        public: result[:public].to_s,
        total: result[:total].to_s,
        price: (result[:total] * 2 / 12).consumer_price(Currency::SEK).to_s
      }
    end
  end
end
