# frozen_string_literal: true

FactoryBot.define do
  factory :lifestyle_choice do |lc|
    lc.sequence(:co2) { |n| n }
  end
end
