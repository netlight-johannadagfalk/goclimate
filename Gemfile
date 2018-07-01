source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end

gem 'rails', '~> 5.1.6'

# Environment
gem 'pg', '~> 0.21'
gem 'puma', '~> 3.7'
gem 'rack-reverse-proxy', '~> 0.12.0', require: 'rack/reverse_proxy'

# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 3.0'

# Authentication
gem 'devise', '~> 4.4.3'
gem 'devise-i18n', '~> 1.6.2'
gem 'omniauth', '~> 1.8.1'

# I18n
gem 'http_accept_language', '~> 2.1.1'

# Views
gem 'country_select', '~> 3.1.1'
gem 'client_side_validations', '~> 11.1.2'
gem 'gon', '~> 6.2.0'
gem 'jbuilder', '~> 2.7.0'

# Assets
gem 'uglifier', '>= 1.3.0'
gem 'sass-rails', github: "rails/sass-rails"
gem 'bootstrap-sass', '~> 3.3.6'
gem 'jquery-rails', '~> 4.3.1'
gem 'font-awesome-rails', '~> 4.7.0'

# Third-party integrations
gem 'stripe', git: 'https://github.com/stripe/stripe-ruby', ref: 'f6484e3'
gem 'sendgrid-ruby', '~> 4.3.1'
gem 'intercom-rails', '~> 0.3.5'
gem 'rollbar', '~> 2.16.2'

# Utilities
gem 'seed_dump', '~> 3.2'

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
  # Adds support for Capybara system testing and selenium driver
  gem 'capybara', '~> 3.3'
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
