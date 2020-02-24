# frozen_string_literal: true

class AirportSuggestionsController < ApplicationController
  def index
    render json: {
      suggestions: suggestions
    }
  end

  private

  def suggestions
    FootprintCalculation::Airport.search(params[:q]).take(5).map do |a|
      {
        iata_code: a.iata_code,
        name: "#{a.name} (#{a.iata_code})"
      }
    end
  end
end
