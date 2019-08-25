# frozen_string_literal: true

module Webpack
  class DevelopmentMiddleware < Rack::Proxy
    def perform_request(env)
      if env['PATH_INFO'].start_with?("/#{Webpack.config[:output_path]}") && Webpack.dev_server_running?
        env['HTTP_HOST'] = "#{Webpack.config[:dev_server_host]}:#{Webpack.config[:dev_server_port]}"

        super(env)
      else
        @app.call(env)
      end
    end
  end
end
