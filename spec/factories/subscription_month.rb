# frozen_string_literal: true

FactoryBot.define do
  factory :subscription_month, class: 'Subscriptions::SubscriptionMonth' do
    start_at { Time.now }
    co2e { 1000 }
    user
    association :payment, factory: :card_charge_monthly
  end
end
