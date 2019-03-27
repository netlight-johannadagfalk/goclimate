# frozen_string_literal: true

module Api
  module V1
    class FlightFootprintsController < ApiController
      REQUIRED_PARAMS = [:cabin_class].freeze
      REQUIRED_SEGMENT_PARAMS = [:flight, :origin, :destination, :duration, :departure_date].freeze
      VALID_CABIN_CLASSES = %w[economy premium_economy business first].freeze
      VALID_CURRENCIES = %w[EUR USD SEK NOK].freeze

      before_action :validate_show_params, only: :show

      def show
        render json: {
          footprint: footprint,
          offset_prices: [
            {
              amount: offset_price_amount,
              currency: 'SEK'
            }
          ],
          details_url: root_url
        }
      end

      private

      # This algorithm is a very simple estimate. In our own testing, a
      # distance-based estimate is more accurate. We should switch to one as soon
      # as we got time to build what we need for it.
      def footprint
        @footprint ||= (total_duration.to_f / 60 / 60 * 0.2).round(1)
      end

      def offset_price_amount
        (footprint * LifestyleChoice::SEK_PER_TONNE).to_i * 100
      end

      def total_duration
        if params[:segments].present?
          segments_params.map { |segment_params| segment_params[:duration].to_i }.reduce(0, :+)
        else
          params[:duration]
        end
      end

      def segments_params
        @segments_params ||= extract_segments_params
      end

      def extract_segments_params
        segments_params = []
        params[:segments].each { |_, segment_params| segments_params << segment_params }
        segments_params
      end

      def validate_show_params
        render json: { type: :invalid_request_error }, status: 400 unless show_params_valid?
      end

      def show_params_valid?
        REQUIRED_PARAMS.each do |parameter|
          return false unless params[parameter].present?
        end

        return false unless segments_params_valid?

        return false unless VALID_CABIN_CLASSES.include?(params[:cabin_class])

        return false unless params[:currencies].nil? || params[:currencies].all? { |c| VALID_CURRENCIES.include?(c) }

        true
      end

      def segments_params_valid?
        if params[:segments].present?
          params[:segments].each do |_, segment_params|
            return false unless segment_params_valid?(segment_params)
          end
        else
          return false unless segment_params_valid?(params)
        end

        true
      end

      def segment_params_valid?(params)
        REQUIRED_SEGMENT_PARAMS.each do |parameter|
          return false unless params[parameter].present?
        end

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
