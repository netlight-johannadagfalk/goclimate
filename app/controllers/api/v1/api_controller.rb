# frozen_string_literal: true

module Api
  module V1
    class ApiController < ActionController::API
      include ActionController::HttpAuthentication::Basic::ControllerMethods

      before_action :authorize

      private

      def authorize
        render json: { type: :authentication_error }, status: 401 unless speedy_mode? || api_key_valid?
      end

      # Speedy mode is whitelisted at Cloudflare. Any requests to the API
      # endpoints must go through the correct domain (at Cloudflare) to be
      # routed here in production, so IP whitelisting at Cloudflare is enough.
      def speedy_mode?
        params.key?(:speedy)
      end

      def api_key_valid?
        # We only have one API customer so hard-code check their API key
        authenticate_with_http_basic { |username, _| username == '***REMOVED***' }
      end
    end
  end
end
