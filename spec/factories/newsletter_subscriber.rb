# frozen_string_literal: true

FactoryBot.define do
  factory :newsletter_subscriber do
    email { 'test@example.com' }
    newsletter_type { 'consumer' }
  end
end
