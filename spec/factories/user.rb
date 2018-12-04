# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "person#{n}@example.com" }
    password { 'password' }

    factory :user_with_active_subscription do
      stripe_customer_id { 'cus_TEST' }
    end
  end
end
