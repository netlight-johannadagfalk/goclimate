# frozen_string_literal: true

require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module ClimateNeutralLife
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 5.1

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    config.assets.paths << Rails.root.join('vendor', 'assets')

    # Where the I18n library should search for translation files
    I18n.load_path += Dir[Rails.root.join('locale', '*.{rb,yml}')]

    # Whitelist locales available for the application
    I18n.available_locales = [:en, :sv, :de]
    config.i18n.fallbacks = true
    I18n.default_locale = :en

    config.generators do |g|
      g.test_framework :rspec
      g.controller_specs false
      g.helper_specs false
      g.observer_specs false
      g.routing_specs false
      g.view_specs false
    end
  end
end
