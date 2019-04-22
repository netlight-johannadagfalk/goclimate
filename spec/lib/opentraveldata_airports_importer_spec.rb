# frozen_string_literal: true

require 'rails_helper'
require 'csv'

RSpec.describe OpentraveldataAirportsImporter do
  describe '#update' do
    subject(:importer) { described_class.new(airports_csv_path, por_public_csv) }

    let(:airports_csv_path) { 'tmp/airports.csv' }
    let(:por_public_csv) { File.read('spec/fixtures/files/optd_por_public.example.csv') }

    it 'creates airports.csv at given path' do
      File.delete(airports_csv_path) if File.exist?(airports_csv_path)

      importer.import

      expect(File.exist?(airports_csv_path)).to be(true)
    end

    it 'can be run when file already exists' do
      importer.import
      importer.import
    end

    it 'sets header row for config/airports.csv' do
      importer.import

      expect(read_csv.headers).to eq(%w[iata_code name name_sv latitude longitude])
    end

    # ['ARN', 'Stockholm Arlanda Airport', 'Stockholm-Arlanda flygplats', 59.651944, 17.918611]
    it 'includes airports from provided csv' do
      importer.import

      expect(read_csv.map { |line| line['iata_code'] }).to contain_exactly('ARN', 'ZRH', 'AFA', 'AHH', 'MSN')
    end

    it 'imports names' do
      importer.import

      expect(read_csv.to_a).to include(
        ['ARN', 'Stockholm Arlanda Airport', anything, anything, anything]
      )
    end

    it 'imports Swedish names when available' do
      importer.import

      expect(read_csv.to_a).to include(
        ['ARN', anything, 'Stockholm-Arlanda flygplats', anything, anything]
      )
    end

    it 'imports empty Swedish name when not available' do
      importer.import

      expect(read_csv.to_a).to include(
        ['ZRH', anything, nil, anything, anything]
      )
    end

    it 'imports names with quotes in them' do
      importer.import

      expect(read_csv.to_a).to include(
        ['AFA', 'San Rafael "Santiago Germano" Airport', anything, anything, anything]
      )
    end

    it 'imports coordinates' do
      importer.import

      expect(read_csv.to_a).to include(
        ['ARN', anything, anything, '59.651944', '17.918611']
      )
    end

    it 'filters out anything that is not an airport' do
      importer.import

      expect(read_csv.to_a).not_to include(
        ['ARN', 'Arlanda Centralstation', anything, anything, anything]
      )
    end
  end

  def read_csv
    return nil unless File.exist?(airports_csv_path)

    CSV.read(airports_csv_path, headers: true)
  end
end
