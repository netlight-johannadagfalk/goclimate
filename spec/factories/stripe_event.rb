# frozen_string_literal: true

FactoryBot.define do
  factory :stripe_event do |se|
    se.sequence(:stripe_customer_id) { |n| n }
  end
end
