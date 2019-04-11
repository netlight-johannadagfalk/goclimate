# frozen_string_literal: true

require 'rails_helper'

RSpec.describe FlightOffset do
  describe '#co2e' do
    it 'validates presence' do
      flight_offset = described_class.new
      flight_offset.validate
      expect(flight_offset.errors).to have_key(:co2e)
    end
  end

  describe '#charged_amount' do
    it 'validates presence' do
      flight_offset = described_class.new
      flight_offset.validate
      expect(flight_offset.errors).to have_key(:charged_amount)
    end
  end

  describe '#charged_currency' do
    it 'validates presence' do
      flight_offset = described_class.new
      flight_offset.validate
      expect(flight_offset.errors).to have_key(:charged_currency)
    end
  end

  describe '#email' do
    it 'validates presence' do
      flight_offset = described_class.new
      flight_offset.validate
      expect(flight_offset.errors).to have_key(:email)
    end
  end

  describe '#stripe_charge_id' do
    it 'validates presence' do
      flight_offset = described_class.new
      flight_offset.validate
      expect(flight_offset.errors).to have_key(:stripe_charge_id)
    end
  end

  describe '#key' do
    it 'validates key to be unique' do
      existing = create(:flight_offset, key: 'a9993e364706816aba3e25717850c26c9cd0d89d')
      flight_offset = described_class.new(key: existing.key)

      flight_offset.validate
      expect(flight_offset.errors).to have_key(:key)
    end

    it 'validates key to look like a SHA1 (40 hex characters)' do
      flight_offset = build(:flight_offset)
      flight_offset.key = 'not a sha'

      flight_offset.validate
      expect(flight_offset.errors).to have_key(:key)
    end

    it 'generates key when creating new gift card' do
      flight_offset = create(:flight_offset)

      expect(flight_offset.key).to be_present
    end

    it 'does not overwrite key when changing existing gift card' do
      flight_offset = create(:flight_offset)

      expect do
        flight_offset.save
      end.not_to change(flight_offset, :key)
    end
  end
end
