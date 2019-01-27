# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "person#{n}@example.com" }
    password { 'password' }
    stripe_customer_id { 'cus_TEST' }

    # There currently isn't any way of telling whether users have active
    # subscriptions, so all users are considered active
    factory :user_with_active_subscription
  end
end
