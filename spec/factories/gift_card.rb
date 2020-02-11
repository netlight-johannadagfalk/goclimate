# frozen_string_literal: true

FactoryBot.define do
  factory :gift_card do
    key { 'a9993e364706816aba3e25717850c26c9cd0d89d' }
    number_of_months { 6 }
    message { 'God jul önskar tomten' }
    co2e { 11_000 }
    price { 440_00 }
    currency { 'sek' }
    customer_email { 'test@example.com' }
    payment_intent_id { 'pi_TEST' }
  end
end
