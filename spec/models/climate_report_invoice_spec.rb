# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ClimateReportInvoice do
  describe '#calculate_from_report' do
    subject(:invoice) do
      calculation = create(:climate_report_calculation, :ten_tonnes)
      described_class.new(climate_report: calculation.climate_report)
    end

    it 'sets co2e from calculation' do
      invoice.calculate_from_report

      expect(invoice.co2e).to eq(invoice.climate_report.calculation.total_emissions * 2)
    end

    it 'calculates price from calculated co2e' do
      invoice.calculate_from_report

      expect(invoice.amount).to eq(2_100_00) # 10 tonnes * 2 for safety * 55 SEK per tonne + 1000 SEK admin = 2100 SEK
    end

    it 'calculates price from calculated co2e for 30 employees' do
      invoice.climate_report.employees = 30
      invoice.calculate_from_report

      expect(invoice.amount).to eq(6_100_00) # 10 tonnes * 2 for safety * 55 SEK per tonne + 5000 SEK admin = 6100 SEK
    end

    it 'sets currency to SEK' do
      invoice.calculate_from_report

      expect(invoice.currency).to eq('sek')
    end
  end

  describe '#climate_report' do
    it 'validates presence' do
      invoice = described_class.new

      invoice.validate

      expect(invoice.errors.keys).to include(:climate_report)
    end
  end

  describe '#invoice_address' do
    it 'validates presence' do
      invoice = described_class.new

      invoice.validate

      expect(invoice.errors.keys).to include(:invoice_address)
    end
  end

  describe '#co2e' do
    it 'validates presence' do
      invoice = described_class.new

      invoice.validate

      expect(invoice.errors.keys).to include(:co2e)
    end
  end

  describe '#amount' do
    it 'validates presence' do
      invoice = described_class.new

      invoice.validate

      expect(invoice.errors.keys).to include(:amount)
    end
  end

  describe '#currency' do
    it 'validates presence' do
      invoice = described_class.new

      invoice.validate

      expect(invoice.errors.keys).to include(:currency)
    end
  end
end
