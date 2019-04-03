# frozen_string_literal: true

require 'rails_helper'

RSpec.describe FlightOffsetParameters do
  let(:cabin_class) { 'economy' }
  let(:segments) do
    [
      FlightSegment.new(origin: 'ARN', destination: 'JFK'),
      FlightSegment.new(origin: 'JFK', destination: 'ARN')
    ]
  end
  let(:serilized_paramters) { 'economy,ARN,JFK,JFK,ARN' }

  describe '#initialize' do
    it 'sets cabin_class' do
      serializer = described_class.new('economy', segments)

      expect(serializer.cabin_class).to eq('economy')
    end

    it 'sets first destination and origin' do
      serializer = described_class.new(cabin_class, segments)

      expect(serializer.segments).to eq(segments)
    end
  end

  describe '#to_s' do
    subject(:serializer) { described_class.new(cabin_class, segments) }

    it 'serializes the parameters' do
      expect(serializer.to_s).to eq(serilized_paramters)
    end
  end

  describe '.from_s' do
    it 'returns an instance' do
      expect(described_class.from_s(serilized_paramters)).to be_an_instance_of(described_class)
    end

    it 'sets cabin_class' do
      expect(described_class.from_s(serilized_paramters).cabin_class).to eq('economy')
    end

    it 'sets segments' do
      expect(described_class.from_s(serilized_paramters).segments).to eq(segments)
    end
  end
end
