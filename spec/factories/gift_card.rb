# frozen_string_literal: true

FactoryBot.define do
  factory :gift_card do
    number_of_months { 6 }
    message { 'God jul önskar tomten' }
    co2e { 11_000 }
    price_incl_taxes { 440_00 }
    price { 352_00 }
    vat_amount { 88_00 }
    country { 'SE' }
    currency { 'sek' }
    customer_email { 'test@example.com' }
    payment_intent_id { 'pi_TEST' }

    factory :gift_card_paid do
      paid_at { Time.now }
    end
  end
end
