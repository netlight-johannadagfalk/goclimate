# frozen_string_literal: true

module Webpack
  class DevelopmentMiddleware < Rack::Proxy
    def perform_request(env)
      if env['PATH_INFO'].start_with?("/#{Webpack.config[:output_path]}") && dev_server_running?
        env['HTTP_HOST'] = "#{dev_server_host}:#{dev_server_port}"

        super(env)
      else
        @app.call(env)
      end
    end

    private

    def dev_server_running?
      Socket.tcp(dev_server_host, dev_server_port, connect_timeout: 0.01).close
      true
    rescue StandardError
      false
    end

    def dev_server_host
      Webpack.config[:dev_server_host]
    end

    def dev_server_port
      Webpack.config[:dev_server_port]
    end
  end
end
