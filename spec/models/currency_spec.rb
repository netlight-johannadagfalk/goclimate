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
  end
end
