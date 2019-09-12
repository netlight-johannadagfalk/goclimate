# frozen_string_literal: true

require 'webpack'

ActiveSupport.on_load(:action_controller_base) do
  helper Webpack::Helper
end

ActiveSupport.on_load(:action_view) do
  include Webpack::Helper
end

Rails.configuration.middleware.insert_before(0, Webpack::DevelopmentMiddleware) if Rails.env.development?
