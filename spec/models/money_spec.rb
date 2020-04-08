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

    it 'raises ArgumentError when subunit amount is not an integer' do
      expect do
        described_class.new(1_00.0, :sek)
      end.to raise_error(ArgumentError)
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

  describe '<=>' do
    subject(:money) { described_class.new(1_000_00, :sek) }

    let(:small_amount) { described_class.new(1_00, :sek) }
    let(:large_amount) { described_class.new(2_000_00, :sek) }

    context 'when the currency is the same' do
      it { is_expected.to be > small_amount }
      it { is_expected.to be < large_amount }
      it { is_expected.to be == money }
    end

    context 'when the currency differs' do
      let(:usd_money) { described_class.new(2_000_00, :usd) }

      it 'returns nil' do
        expect(money <=> usd_money).to be_nil
      end
    end
  end

  describe '*' do
    it 'multiplies with given number' do
      expect(described_class.new(40_00, :sek) * BigDecimal('1.5'))
        .to eq(described_class.new(60_00, :sek))
    end

    it 'rounds multiplied numbers' do
      money = described_class.new(40_00, :sek) * 1.232

      expect(money.subunit_amount).to be_an(Integer)
    end
  end

  describe 'ceil' do
    it 'rounds up to major unit' do
      expect(described_class.new(5_75, :sek).ceil).to eq(described_class.new(6_00, :sek))
    end

    it 'allows setting precision' do
      expect(described_class.new(5_75, :sek).ceil(-1)).to eq(described_class.new(5_80, :sek))
    end
  end

  describe 'amount' do
    subject(:money) { described_class.new(1_000_00, :sek) }

    it 'returns the subunit_amount / 100' do
      expect(money.amount).to eq(1_000)
    end
  end
end
