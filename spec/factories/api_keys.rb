# frozen_string_literal: true

FactoryBot.define do
  factory :api_key do
    name { 'Name' }
    usage_description { 'Will use for legendary projects.' }
    contact_name { 'First Last' }
    contact_email { 'email@example.com' }
  end
end
