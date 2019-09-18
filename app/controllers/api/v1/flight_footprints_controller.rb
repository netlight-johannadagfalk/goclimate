# frozen_string_literal: true

module Api
  module V1
    class FlightFootprintsController < ApiController
      VALID_CABIN_CLASSES = %w[economy premium_economy business first].freeze
      VALID_CURRENCIES = %w[EUR USD SEK NOK].freeze

      before_action :validate_currencies_param, only: :show
      before_action :set_and_validate_footprint, only: :show
      before_action :set_cache_headers, only: :show

      def show
        render json: {
          footprint: footprint,
          offset_prices: [
            {
              amount: offset_price_amount,
              currency: 'SEK'
            }
          ],
          details_url: new_flight_offset_url(params: { offset_params: offset_params })
        }
      rescue FootprintCalculation::Airport::NotFoundError
        render json: { type: :calculation_unsuccessful }, status: 404
      end

      private

      def footprint
        @footprint.footprint
      end

      def offset_price_amount
        (footprint.to_f / 1000 * LifestyleChoice::SEK_PER_TONNE).to_i * 100
      end

      def set_and_validate_footprint
        @footprint = FootprintCalculation::FlightFootprint.new(footprint_params)

        render json: { type: :invalid_request_error }, status: 400 unless @footprint.valid?
      end

      def set_cache_headers
        expires_in(rand(7.days.to_i..14.days.to_i), private: true)
      end

      def validate_currencies_param
        return if currencies_param.nil? || currencies_param.all? { |c| VALID_CURRENCIES.include?(c) }

        render json: { type: :invalid_request_error }, status: 400
      end

      def footprint_params
        params.permit(:cabin_class).merge(segments: segments)
      end

      # This allows API clients to either repeat currencies with
      # `currencies[]=SEK&currencies[]=NOK` or
      # `currencies[0]=SEK&currencies[1]=NOK` or
      # `currencies=['SEK','NOK']` or
      # `currencies='SEK,NOK'`
      def currencies_param
        if params[:currencies].is_a?(ActionController::Parameters)
          params[:currencies].values
        elsif params[:currencies].is_a?(String)
          params[:currencies].split(',')
        else
          params[:currencies]
        end
      end

      def offset_params
        FlightOffsetParameters.new(
          params[:cabin_class],
          @footprint.segments
        ).to_s
      end

      def segments
        if params[:segments].nil?
          [FootprintCalculation::FlightSegment.new(params.permit(:origin, :destination))]
        else
          params[:segments].values.map do |segment_params|
            FootprintCalculation::FlightSegment.new(segment_params.slice(:origin, :destination))
          end
        end
      end
    end
  end
end
