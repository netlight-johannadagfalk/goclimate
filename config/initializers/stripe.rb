# frozen_string_literal: true

Rails.configuration.stripe = {
  publishable_key: ENV['PUBLISHABLE_KEY'],
  secret_key: ENV['SECRET_KEY']
}

Stripe.api_key = Rails.configuration.stripe[:secret_key]
Stripe.api_version = '2020-08-27'
Stripe.logger =
  if Rails.env.development?
    # Development logger is by default only pointing to the log file, not
    # stdout. Make sure we see what's going on in stdout instead of the log
    # file.
    Logger.new($stdout, level: :info, formatter: Rails.logger.formatter)
  else
    # Default in production is debug level, which would log potential sensitive
    # information in this case. Make sure to not do that.
    Rails.logger.dup.tap { |l| l.level = Logger::INFO if l.debug? }
  end
