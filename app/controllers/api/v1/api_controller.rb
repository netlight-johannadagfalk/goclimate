# frozen_string_literal: true

module Api
  module V1
    class ApiController < ActionController::API
      include ActionController::HttpAuthentication::Basic::ControllerMethods

      before_action :set_cors_headers, :authorize

      def url_options
        # API runs on a separate subdomain in production, so make sure the default
        # subdomain is always `www` for route helpers
        return super.merge(subdomain: 'www') if ENV['HEROKU_ENV'] == 'production'

        super
      end

      private

      def authorize
        render json: { type: :authentication_error }, status: 401 unless api_key_valid?
      end

      def set_cors_headers
        headers['Access-Control-Allow-Origin'] = '*'
      end

      def api_key_valid?
        authenticate_with_http_basic do |username, _|
          ApiKey.exists?(key: filter_disallowed_characters(username))
        end
      end

      # Filters disallowed characters from the API key. For example invalid
      # unicode byte sequences as a result of strings that weren't base 64
      # encoded properly. A few keys in production use - and _, so allow those
      # in addition to what ApiKey validates.
      def filter_disallowed_characters(api_key)
        api_key.tr('^a-zA-Z0-9\-_', '')
      end
    end
  end
end
