# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ClimateReportPdf do
  subject(:crp) { described_class.new(calculation.climate_report) }

  let(:calculation) { create(:climate_report_calculation, :ten_tonnes) }
  let(:climate_report) { create(:climate_report, calculation: calculation) }
  let(:invoice) { create(:climate_report_invoice, climate_report: climate_report) }

  describe '#get_even_percentages' do
    it 'returns a correctly rounded hash' do
      data = { "a": 0.5, "b": 0.51, "c": 98.9 }
      expect(crp.get_even_percentages(data)).to eq({ "a": 0, "b": 1, "c": 99 })
    end

    it 'returns a correctly rounded hash when max is provided' do
      data = { "a": 0.5, "b": 0.51, "c": 8.9 }
      expect(crp.get_even_percentages(data, 10)).to eq({ "a": 0, "b": 1, "c": 9 })
    end
  end

  describe '#category_fields' do
    it 'returns the category fields with emissions data' do
      category_fields = [
        { emissions: 0, name: 'energy', scope: [2, 3] },
        { emissions: 0, name: 'business_trips', scope: [3] },
        { emissions: 0, name: 'meals', scope: [3] },
        { emissions: 0, name: 'material', scope: [3] },
        { emissions: 10_000, name: 'other', scope: [3] }
      ]

      expect(crp.category_fields).to eq(category_fields)
    end
  end

  describe '#emission_sources_fields' do
    it 'returns the emission sources fields with emissions data' do
      emission_sources_fields = {
        category: 'energy',
        emissions: 0,
        name: 'electricity_consumption',
        scope: [2]
      }

      expect(crp.emission_sources_fields).to include(emission_sources_fields)
    end
  end

  describe '#compare_category_bar_data' do
    it 'returns the compare data' do
      compare_data = [{ 'Other' => 2500 }, { 'Other - average' => 2500 }]
      invoice.save! # why is invoice not saved in let statement?

      expect(crp.compare_bar_data(crp.category_fields)).to eq(compare_data)
    end
  end

  describe '#compare_bar_data' do
    it 'returns the compare data' do
      compare_data = [{ 'Other' => 2500 }, { 'Other - average' => 2500 }]
      invoice.save! # why is invoice not saved in let statement?

      expect(crp.compare_bar_data(crp.emission_sources_fields)).to eq(compare_data)
    end
  end
end
