# frozen_string_literal: true

FactoryBot.define do
  factory :flight_offset do
    co2e { 1000 }
    price { 4200 }
    currency { 'sek' }
    email { 'test@example.com' }
    stripe_charge_id { 'ch_1ENl8wHwuhGySQCd3z7kAlRu' }
    payment_intent_id { 'pi_TEST' }

    factory :flight_offset_paid do
      paid_at { Time.now }
    end
  end
end
