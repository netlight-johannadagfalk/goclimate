# frozen_string_literal: true

require 'rails_helper'

RSpec.describe FlightSegment do
  describe '#initialize' do
    it 'sets flight designator' do
      expect(described_class.new(flight: 'VY1266').flight).to eq('VY1266')
    end

    it 'sets origin' do
      expect(described_class.new(origin: 'ARN').origin).to eq('ARN')
    end

    it 'sets destination' do
      expect(described_class.new(destination: 'BCN').destination).to eq('BCN')
    end
  end

  describe '#flight' do
    it 'validates presence' do
      segment = described_class.new

      segment.validate

      expect(segment.errors).to include(:flight)
    end
  end

  describe '#origin' do
    it 'validates presence' do
      segment = described_class.new

      segment.validate

      expect(segment.errors).to include(:origin)
    end
  end

  describe '#destination' do
    it 'validates presence' do
      segment = described_class.new

      segment.validate

      expect(segment.errors).to include(:destination)
    end
  end
end
