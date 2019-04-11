# frozen_string_literal: true

FactoryBot.define do
  factory :flight_offset do
    co2e { 1000 }
    charged_amount { 4200 }
    charged_currency { 'sek' }
    email { 'test@example.com' }
    stripe_charge_id { 'ch_1ENl8wHwuhGySQCd3z7kAlRu' }
  end
end
