# frozen_string_literal: true

require 'rails_helper'

RSpec.describe GreenhouseGases do
  describe '.from_consumer_price' do
    it 'uses 60 SEK per tonne' do
      expect(described_class.from_consumer_price(Money.new(106_50, :sek))).to eq(described_class.new(1775))
    end

    it 'uses 6 EUR per tonne' do
      expect(described_class.from_consumer_price(Money.new(10_65, :eur))).to eq(described_class.new(1775))
    end

    it 'uses 7 USD per tonne' do
      expect(described_class.from_consumer_price(Money.new(12_51, :usd))).to eq(described_class.new(1788))
    end

    it 'rounds up to nearest kg' do
      expect(described_class.from_consumer_price(Money.new(8_10, :usd))).to eq(described_class.new(1158))
    end
  end

  describe '#initialize' do
    it 'raises ArgumentError when co2e is not an integer' do
      expect do
        described_class.new('2')
      end.to raise_error(ArgumentError)
    end
  end

  describe '#consumer_price' do
    it 'uses 60 SEK per tonne, rounded up to nearest 1 krona' do
      expect(described_class.new(1505).consumer_price(Currency::SEK))
        .to eq(Money.new(91_00, :sek))
    end

    it 'uses 7 USD per tonne, rounded up to nearest 10 cents' do
      expect(described_class.new(1502).consumer_price(Currency::USD))
        .to eq(Money.new(10_60, :usd))
    end

    it 'uses 6 EUR per tonne, rounded up to nearest 10 cents' do
      expect(described_class.new(1520).consumer_price(Currency::EUR))
        .to eq(Money.new(9_20, :eur))
    end
  end

  describe '#business_price' do
    it 'uses 55 SEK per tonne, rounded up to nearest 1 krona' do
      expect(described_class.new(1505).business_price(Currency::SEK))
        .to eq(Money.new(83_00, :sek))
    end

    it 'uses 8.5 SEK per USD factor for USD, rounded up to nearest 10 cents' do
      expect(described_class.new(1500).business_price(Currency::USD))
        .to eq(Money.new(9_80, :usd))
    end

    it 'uses 10 SEK per EUR factor for EUR, rounded up to nearest 10 cents' do
      expect(described_class.new(1520).business_price(Currency::EUR))
        .to eq(Money.new(8_40, :eur))
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
    it 'formats in kgs by default ' do
      expect(described_class.new(768).to_s).to eq('768 kg CO2e')
    end

    it 'uses delimiters for large numbers' do
      expect(described_class.new(1_000).to_s).to eq('1,000 kg CO2e')
    end

    it 'rounds to nearest 0.1 tonnes with option unit: :tonnes' do
      expect(described_class.new(768).to_s(unit: :tonnes)).to eq('0.8 tonnes CO2e')
    end

    it 'rounds to nearest 0.01 tonnes with option unit: :tonnes and values under 0.1 tonnes' do
      expect(described_class.new(68).to_s(unit: :tonnes)).to eq('0.07 tonnes CO2e')
    end

    it 'allows setting precision for tonnes' do
      expect(described_class.new(50_100).to_s(unit: :tonnes, precision: 0)).to eq('50 tonnes CO2e')
    end

    it 'delimits large numbers in tonnes' do
      expect(described_class.new(500_000_100).to_s(unit: :tonnes)).to eq('500,000.1 tonnes CO2e')
    end

    context 'with a locale with different formatting' do
      around do |example|
        I18n.with_locale(:sv, &example)
      end

      it 'uses delimiter for kgs' do
        expect(described_class.new(1_000).to_s).to eq('1 000 kg koldioxid')
      end

      it 'uses delimiter and separator for tonnes' do
        expect(described_class.new(1_000_100).to_s(unit: :tonnes)).to eq('1 000,1 ton koldioxid')
      end
    end
  end
end
