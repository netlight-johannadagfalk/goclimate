# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CountryType do
  subject(:country_type) { described_class.new }

  describe '#cast' do
    it 'casts ISO strings to countries' do
      expect(country_type.cast('se')).to eq(ISO3166::Country.new('se'))
    end
  end

  describe '#serialize' do
    it 'lowercases strings' do
      expect(country_type.serialize('SE')).to eq('se')
    end

    it 'serializes ISO3166::Country instances' do
      expect(country_type.serialize(ISO3166::Country.new('se'))).to eq('se')
    end
  end
end
