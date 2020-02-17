# frozen_string_literal: true

require 'rails_helper'

RSpec.describe FootprintCalculation::Airport do
  describe 'attributes' do
    it 'has iata_code set from data file' do
      expect(described_class.find('ARN').iata_code).to eq('ARN')
    end

    it 'has name set from data file' do
      expect(described_class.find('ARN').name).to eq('Stockholm Arlanda Airport')
    end

    it 'has Swedish name set from data file' do
      expect(described_class.find('ARN').name_sv).to eq('Stockholm-Arlanda flygplats')
    end

    it 'has latitude set from data file' do
      expect(described_class.find('ARN').latitude).to eq(59.651944)
    end

    it 'has longitude set from data file' do
      expect(described_class.find('ARN').longitude).to eq(17.918611)
    end
  end

  describe '.find' do
    it 'returns airport by IATA code' do
      expect(described_class.find('ARN')).to be_an_instance_of(described_class)
    end

    it 'raises NotFoundError when not found' do
      expect do
        described_class.find('XXX')
      end.to raise_error(FootprintCalculation::Airport::NotFoundError)
    end
  end

  describe '.search' do
    it 'returns airports including the provided string' do
      results = described_class.search('Arlanda')

      expect(results).to include(described_class.find('ARN'))
    end

    it 'is case insensitive' do
      results = described_class.search('arlanda')

      expect(results).to include(described_class.find('ARN'))
    end

    it 'returns airport with IATA code equal to provided string' do
      results = described_class.search('arn')

      expect(results).to include(described_class.find('ARN'))
    end

    it 'returns airport matched by code first in list' do
      results = described_class.search('arn')

      expect(results.first).to eq(described_class.find('ARN'))
    end
  end

  describe '#distance_to' do
    let(:arn) { described_class.find('ARN') }
    let(:jfk) { described_class.find('JFK') }
    let(:muc) { described_class.find('MUC') }

    it 'returns correct kilometers for ARN-JFK' do
      expect(arn.distance_to(jfk)).to eq(6292)
    end

    it 'returns correct kilometers for ARN-MUC' do
      expect(arn.distance_to(muc)).to eq(1317)
    end
  end

  describe '#name_sv' do
    it 'returns name when Swedish name is missing' do
      zurich = described_class.find('ZRH')

      expect(zurich.name_sv).to eq(zurich.name)
    end
  end
end
