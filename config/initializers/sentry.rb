# frozen_string_literal: true

Raven.configure do |config|
  config.current_environment =
    if ENV['DEPLOYMENT_ENV'] == 'pr' && ENV['HEROKU_APP_NAME'].present?
      "pr-#{ENV['HEROKU_APP_NAME'].delete('^0-9')}"
    else
      ENV['DEPLOYMENT_ENV'].presence || Rails.env
    end
end
