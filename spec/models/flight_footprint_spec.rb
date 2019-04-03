# frozen_string_literal: true

require 'rails_helper'

RSpec.describe FlightFootprint do
  let(:segments) { [FlightSegment.new(flight: 'VY1266', origin: 'ARN', destination: 'BCN')] }

  describe '#initialize' do
    it 'sets cabin class' do
      expect(described_class.new(cabin_class: :economy).cabin_class).to eq(:economy)
    end

    it 'sets segments' do
      expect(described_class.new(segments: segments).segments).to eq(segments)
    end
  end

  describe '#cabin_class' do
    it 'validates presence' do
      footprint = described_class.new

      footprint.validate

      expect(footprint.errors).to include(:cabin_class)
    end

    it 'validates inclusion in allowed values' do
      footprint = described_class.new(cabin_class: :invalid)

      footprint.validate

      expect(footprint.errors).to include(:cabin_class)
    end
  end

  describe '#segments' do
    it 'validates all its segments' do
      footprint = described_class.new(segments: [FlightSegment.new])

      footprint.validate

      expect(footprint.errors).to include(:segments)
    end
  end

  describe '#footprint' do
    let(:footprint) do
      described_class.new(
        cabin_class: 'economy',
        segments: [
          FlightSegment.new(flight: 'VY1266', origin: 'ARN', destination: 'BCN'),
          FlightSegment.new(flight: 'VY1265', origin: 'BCN', destination: 'ARN')
        ]
      )
    end

    it 'calculates footprint for all segments, ceiled to nearest 100 kg' do
      expect(footprint.footprint).to eq(1000)
    end
  end
end
