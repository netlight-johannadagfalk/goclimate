# frozen_string_literal: true

FactoryBot.define do
  factory :stripe_event do |se|
    se.sequence(:stripe_customer_id) { |n| n }

    factory :stripe_event_paid_charge do
      stripe_object { 'charge' }
      paid { true }

      factory :stripe_event_monthly do
        stripe_amount { 80_00 }
        currency { 'sek' }
        gift_card { false }
      end

      factory :stripe_event_gift_card do
        stripe_amount { 220_00 }
        gift_card { true }
      end
    end
  end
end
