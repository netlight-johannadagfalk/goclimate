# frozen_string_literal: true

Rails.configuration.stripe = {
  publishable_key: ENV['PUBLISHABLE_KEY'],
  secret_key: ENV['SECRET_KEY']
}

Stripe.api_key = Rails.configuration.stripe[:secret_key]
Stripe.api_version = '2019-10-17'
Stripe.log_level = Stripe::LEVEL_INFO
