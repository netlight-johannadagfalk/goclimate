# frozen_string_literal: true

# This file is used by Rack-based servers to start the application.

require_relative 'config/environment'

use Rack::ReverseProxy do
  # Set :preserve_host to true globally (default is true already)
  reverse_proxy_options preserve_host: true, x_forwarded_headers: true

  # Forward the path /blog/* to http://goclimateneutral.nilver.se*
  reverse_proxy(%r{^/blog(/.*)$}, 'http://goclimateneutral.nilver.se$1')

  # Forward the path /se/blog/* to http://goclimateneutral.nilver.se* and set the lang to sv
  reverse_proxy(%r{^/se/blog(/.*)$}, 'http://goclimateneutral.nilver.se$1?lang=sv')
end

run Rails.application
