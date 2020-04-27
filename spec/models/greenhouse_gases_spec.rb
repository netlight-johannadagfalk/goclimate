# frozen_string_literal: true

require 'rails_helper'

RSpec.describe GreenhouseGases do
  describe '#initialize' do
    it 'raises ArgumentError when co2e is not an integer' do
      expect do
        described_class.new('2')
      end.to raise_error(ArgumentError)
    end
  end

  describe '#consumer_price' do
    it 'uses 40 SEK per tonne, roundet up to nearest 1 krona' do
      expect(described_class.new(1505).consumer_price(Currency::SEK))
        .to eq(Money.new(61_00, :sek))
    end

    it 'uses 8.5 SEK per USD factor for USD, rounded up to nearest 10 cents' do
      expect(described_class.new(1500).consumer_price(Currency::USD))
        .to eq(Money.new(7_10, :usd))
    end

    it 'uses 10 SEK per EUR factor for EUR, rounded up to nearest 10 cents' do
      expect(described_class.new(1520).consumer_price(Currency::EUR))
        .to eq(Money.new(6_10, :eur))
    end
  end

  describe '<=>' do
    it 'compares with other' do
      expect(described_class.new(1000)).to eq(described_class.new(1000))
    end
  end

  describe '*' do
    it 'multiplies with number' do
      expect(described_class.new(1000) * 2).to eq(described_class.new(2000))
    end
  end

  describe '/' do
    it 'divides with number' do
      expect(described_class.new(1000) / 2).to eq(described_class.new(500))
    end
  end

  describe '+' do
    it 'sums with other GreenhouseGases object' do
      expect(described_class.new(1000) + described_class.new(500)).to eq(described_class.new(1500))
    end
  end

  describe '=' do
    it 'subtracts other GreenhouseGases object' do
      expect(described_class.new(1000) - described_class.new(500)).to eq(described_class.new(500))
    end
  end

  describe '#to_s' do
    it 'uses tonnes when evenly divisible by tonnes' do
      expect(described_class.new(1000).to_s).to eq('1 tonne CO2e')
    end

    it 'uses kgs when not evenly divisible by tonnes' do
      expect(described_class.new(768).to_s).to eq('768 kg CO2e')
    end

    it 'rounds to nearest 0.1 tonnes with option precision: :auto' do
      expect(described_class.new(768).to_s(precision: :auto)).to eq('0.8 tonnes CO2e')
    end

    it 'rounds to nearest 0.01 tonnes with option precision: :auto and values under 0.1 tonnes' do
      expect(described_class.new(68).to_s(precision: :auto)).to eq('0.07 tonnes CO2e')
    end
  end
end
