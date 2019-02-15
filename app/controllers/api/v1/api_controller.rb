# frozen_string_literal: true

module Api
  module V1
    class ApiController < ApplicationController
      before_action :authorize

      private

      def authorize
        render json: { type: :authentication_error }, status: 401 unless api_key_valid?
      end

      def api_key_valid?
        # We only have one API customer so hard-code check their API key
        authenticate_with_http_basic { |username, _| username == '***REMOVED***' }
      end
    end
  end
end
