# frozen_string_literal: true

module Api
  module V1
    class FlightFootprintsController < ApiController
      before_action :validate_show_params, only: :show

      def show
        render json: { footprint: 1.0, details_url: root_url }
      end

      private

      def validate_show_params
        render json: { type: :invalid_request_error }, status: 400 unless show_params_valid?
      end

      def show_params_valid?
        params[:flight].present? && params[:origin].present? &&
          params[:destination].present? && params[:duration].present?
      end
    end
  end
end
