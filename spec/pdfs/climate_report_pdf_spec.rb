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

  describe '#categories' do
    it 'returns the category fields with emissions data' do
      categories = [
        { emissions: 0, name: 'energy', scope: [2, 3], percentage: 0 },
        { emissions: 0, name: 'business_trips', scope: [3], percentage: 0 },
        { emissions: 0, name: 'meals', scope: [3], percentage: 0 },
        { emissions: 0, name: 'material', scope: [3], percentage: 0 },
        { emissions: 10_000, name: 'other', scope: [3], percentage: 100 }
      ]

      expect(crp.categories).to eq(categories)
    end
  end

  describe '#emissions' do
    it 'returns the emission sources fields with emissions data' do
      emission_sources = {
        category: 'energy',
        emissions: 0,
        name: 'electricity_consumption',
        scope: [2],
        percentage: 0
      }

      expect(crp.emissions).to include(emission_sources)
    end
  end

  describe '#pie_data' do
    it 'returns the pie chart data' do
      pie_data = {
        data: '100',
        labels: "'Other'"
      }

      expect(crp.pie_data(crp.categories)).to eq(pie_data)
    end
  end

  describe '#bar_compare_data' do
    it 'returns compare data for categories' do
      compare_data = { data: [2500, 2500], labels: ['Other', 'Other - average'] }
      invoice.save! # why is invoice not saved in let statement?

      expect(crp.bar_compare_data(crp.categories)).to eq(compare_data)
    end

    it 'returns compare data for emission sources' do
      compare_data = { data: [2500, 2500], labels: ['Other', 'Other - average'] }
      invoice.save! # why is invoice not saved in let statement?

      expect(crp.bar_compare_data(crp.emissions)).to eq(compare_data)
    end
  end

  describe '#bar_compare_years_data' do
    it 'returns compare data for more then one measurement period' do
      compare_data = {
        data: %w[0 0 20000 0 0 0 0 0 0 10000],
        labels: [
          '2017 - Energy', '2018 - Energy', '2017 - Business trips', '2018 - Business trips',
          '2017 - Number of meals', '2018 - Number of meals', '2017 - Material', '2018 - Material',
          '2017 - Other', '2018 - Other'
        ]
      }

      calc_old = create(:climate_report_calculation, :flight_emissions)
      report_old = create(:climate_report, :old, calculation: calc_old)
      invoice_old = create(:climate_report_invoice, :twenty_tonnes, climate_report: report_old)
      invoice.save!
      invoice_old.save!
      expect(crp.bar_compare_years_data(crp.categories)).to eq(compare_data)
    end

    it 'returns nil when there is no other measurement periods to compare' do
      expect(crp.bar_compare_years_data(crp.categories)).to eq(nil)
    end
  end

  describe '#climate_periods_to_compare' do
    it 'returns the number of climate invoices for that company' do
      invoice.save!
      expect(crp.previous_climate_reports.count).to eq(1)
    end
  end
end
