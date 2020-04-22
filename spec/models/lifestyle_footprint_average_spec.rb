# frozen_string_literal: true

require 'rails_helper'

RSpec.describe LifestyleFootprintAverage do
  describe '#countries' do
    it 'returns ISO3166::Country instances' do
      average = described_class.new(%w[SE], 10_000, 'Source')

      expect(average.countries).to eq([ISO3166::Country.new('SE')])
    end
  end

  describe '#co2e' do
    it 'returns GreenhouseGases instances' do
      average = described_class.new(%w[SE], 10_000, 'Source')

      expect(average.co2e).to eq(GreenhouseGases.new(10_000))
    end
  end

  describe '.find_by_country' do
    it 'returns country average when we have it' do
      expect(described_class.find_by_country(ISO3166::Country.new('SE')).countries)
        .to include(ISO3166::Country.new('SE'))
    end

    it 'returns world average when we do not have country specific figures' do
      expect(described_class.find_by_country(ISO3166::Country.new('KR')))
        .to be(described_class::WORLD)
    end
  end
end
