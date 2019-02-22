# frozen_string_literal: true

module Api
  module V1
    class FlightFootprintsController < ApiController
      REQUIRED_PARAMETERS = [:flight, :origin, :destination, :duration, :cabin_class, :departure_date].freeze
      VALID_CABIN_CLASSES = %w[economy premium_economy business first].freeze

      before_action :validate_show_params, only: :show

      def show
        render json: { footprint: 1.0, details_url: root_url }
      end

      private

      def validate_show_params
        render json: { type: :invalid_request_error }, status: 400 unless show_params_valid?
      end

      def show_params_valid?
        REQUIRED_PARAMETERS.each do |parameter|
          return false unless params[parameter].present?
        end

        return false unless VALID_CABIN_CLASSES.include?(params[:cabin_class])

        begin
          Date.iso8601(params[:departure_date])
        rescue ArgumentError
          return false
        end

        true
      end
    end
  end
end
