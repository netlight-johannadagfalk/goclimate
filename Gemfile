source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end

gem 'rails', '~> 5.1.0.beta1'

# Environment
gem 'pg'
gem 'puma', '~> 3.7'
gem 'rack-reverse-proxy', :require => 'rack/reverse_proxy'

# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 3.0'

# Authentication
gem 'devise'
gem 'devise-i18n'
gem 'omniauth'

# I18n
gem 'http_accept_language'

# Views
gem 'country_select'
gem 'client_side_validations'
gem 'gon'
gem 'jbuilder', '~> 2.5'

# Assets
gem 'uglifier', '>= 1.3.0'
gem 'sass-rails', github: "rails/sass-rails"
gem 'bootstrap-sass', '~> 3.3.6'
gem 'jquery-rails'
gem 'font-awesome-rails'

# Third-party integrations
gem 'stripe', :git => 'https://github.com/stripe/stripe-ruby'
gem 'sendgrid-ruby'
gem 'intercom-rails'
gem 'rollbar'

# Utilities
gem 'seed_dump'

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
  # Adds support for Capybara system testing and selenium driver
  gem 'capybara', '~> 2.7.0'
  gem 'selenium-webdriver'
  gem 'rb-readline'
  gem 'dotenv-rails'
end

group :development do
  # Access an IRB console on exception pages or by using <%= console %> anywhere in the code.
  gem 'web-console', '>= 3.3.0'
  gem 'listen', '>= 3.0.5', '< 3.2'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
