# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Money do
  describe '.from_amount' do
    it 'converts amount to subunit amount' do
      money = described_class.from_amount(1.22, :sek)

      expect(money.subunit_amount).to eq(122)
    end
  end

  describe '#initialize' do
    it 'initializes with subunit amount' do
      money = described_class.new(1_00, Currency::SEK)

      expect(money.subunit_amount).to eq(1_00)
    end

    it 'initializes with currency' do
      money = described_class.new(1_00, Currency::SEK)

      expect(money.currency).to eq(Currency::SEK)
    end

    it 'translates currency ISO code to currency' do
      money = described_class.new(1_00, :sek)

      expect(money.currency).to eq(Currency::SEK)
    end
  end

  describe '#to_s' do
    subject(:money) { described_class.new(1_000_00, :sek) }

    let(:translations) { {} }

    around do |example|
      with_translations(I18n.locale, translations) do
        example.run
      end
    end

    it 'uses ISO currency code' do
      expect(money.to_s).to eq('SEK 1,000.00')
    end

    it 'uses local number formatting' do
      I18n.with_locale(:de) do
        expect(money.to_s).to eq('SEK 1.000,00')
      end
    end

    it 'allows setting of precision' do
      expect(money.to_s(precision: 0)).to eq('SEK 1,000')
    end

    it 'automatically removes fractional digits when 0 with precision set to :auto' do
      expect(money.to_s(precision: :auto)).to eq('SEK 1,000')
    end

    it 'preserves fractional amounts with precision set to :auto' do
      expect(described_class.new(1_000_34, :sek).to_s(precision: :auto)).to eq('SEK 1,000.34')
    end

    context 'with translations for current locale available' do
      let(:translations) do
        {
          models: {
            money: {
              currency_formats: {
                sek: '%{number} kr'
              }
            }
          }
        }
      end

      it 'uses available localization' do
        expect(money.to_s).to eq('1,000.00 kr')
      end
    end
  end
end
