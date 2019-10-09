# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Currency do
  describe '.from_iso_code' do
    it 'returns existing currencies' do
      expect(described_class.from_iso_code(:sek)).to eq(described_class::SEK)
    end

    it 'returns nil when currency is not defined' do
      expect(described_class.from_iso_code(:xxx)).to be_nil
    end

    it 'returns nil when given nil' do
      expect(described_class.from_iso_code(nil)).to be_nil
    end

    it 'returns nil when given an empty string' do
      expect(described_class.from_iso_code('')).to be_nil
    end
  end

  describe '.from_locale' do
    context 'when given :sv' do
      subject { described_class.from_locale(:sv) }

      it { is_expected.to be == Currency::SEK }
    end

    context 'when given :en' do
      subject { described_class.from_locale(:en) }

      it { is_expected.to be == Currency::USD }
    end

    context 'when given :de' do
      subject { described_class.from_locale(:de) }

      it { is_expected.to be == Currency::EUR }
    end

    context 'when given any other locale' do
      subject { described_class.from_locale(:uk) }

      it { is_expected.to be == Currency::USD }
    end
  end
end
