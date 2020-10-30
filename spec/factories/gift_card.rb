# frozen_string_literal: true

FactoryBot.define do
  factory :gift_card do
    number_of_months { 6 }
    message { 'God jul önskar tomten' }
    co2e { 11_000 }
    price { 440_00 }
    currency { 'sek' }
    customer_email { 'test@example.com' }
    payment_intent_id { 'pi_TEST' }

    factory :gift_card_paid do
      paid_at { Time.now }
    end
  end
end
