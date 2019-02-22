# frozen_string_literal: true

source 'https://rubygems.org'
ruby '2.6.1'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?('/')
  "https://github.com/#{repo_name}.git"
end

gem 'rails', '~> 5.2.0'

# Environment
gem 'bootsnap', '~> 1.3'
gem 'pg', '~> 1.0'
gem 'puma', '~> 3.7'
gem 'rack-reverse-proxy', '~> 0.12.0', require: 'rack/reverse_proxy'

# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 3.0'

# Authentication
gem 'devise', '~> 4.5.0'
gem 'devise-i18n', '~> 1.7.1'

# I18n
gem 'http_accept_language', '~> 2.1.1'

# Markdown
gem 'redcarpet', '~> 3.4.0'

# Views
gem 'client_side_validations', '~> 12.1.0'
gem 'country_select', '~> 4.0.0'
gem 'gon', '~> 6.2.0'
gem 'jbuilder', '~> 2.8.0'

# Assets
gem 'bootstrap-sass', '~> 3.3.6'
gem 'font-awesome-rails', '~> 4.7.0'
gem 'jquery-rails', '~> 4.3.1'
gem 'sass-rails', github: 'rails/sass-rails'
gem 'uglifier', '>= 1.3.0'

# Third-party integrations
gem 'intercom-rails', '~> 0.4.0'
gem 'rollbar', '~> 2.18'
gem 'sendgrid-actionmailer', '~> 2.2.1'
gem 'stripe', git: 'https://github.com/stripe/stripe-ruby', ref: 'f6484e3'

# Utilities
gem 'seed_dump', '~> 3.2'

# PDF generation
gem 'wicked_pdf'
gem 'wkhtmltopdf-binary'
# wklhtmltopdf-binary provides binaries for Linux and macOS. If this fails you
# will have to install wkhtmltopdf manually.

group :development, :test do
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
  gem 'capybara', '~> 3.3'
  gem 'dotenv-rails'
  gem 'factory_bot_rails'
  gem 'rb-readline'
  gem 'rspec-rails', '~> 3.7'
  gem 'rubocop', require: false
  gem 'rubocop-rspec', require: false
  gem 'selenium-webdriver'
end

group :development do
  gem 'listen', '>= 3.0.5', '< 3.2'
  # Access an IRB console on exception pages or by using <%= console %> anywhere in the code.
  gem 'guard'
  gem 'guard-rspec', require: false
  gem 'guard-rubocop', require: false
  gem 'pry-byebug' # Drop `binding.pry` anywhere you want to start debugging
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
  gem 'web-console', '>= 3.3.0'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
