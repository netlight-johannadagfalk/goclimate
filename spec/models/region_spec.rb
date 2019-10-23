# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Region do
  describe '.from_slug' do
    it 'returns Europe for nil' do
      expect(described_class.from_slug(nil)).to be == Region::Europe
    end

    it 'returns EuropeGerman for eud' do
      expect(described_class.from_slug('de')).to be == Region::Germany
    end

    it 'returns Sweden for se' do
      expect(described_class.from_slug('se')).to be == Region::Sweden
    end

    it 'returns USA for us' do
      expect(described_class.from_slug('us')).to be == Region::USA
    end

    it 'returns nil for unknown slugs' do
      expect(described_class.from_slug('xx')).to be_nil
    end
  end

  describe '.all' do
    it 'returns all available regions' do
      expect(described_class.all).to be == [Region::Europe, Region::Germany, Region::Sweden, Region::USA]
    end
  end
end
