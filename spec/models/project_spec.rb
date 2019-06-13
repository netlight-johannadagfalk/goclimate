# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Project do
  subject(:project) { described_class.create(carbon_offset: 10) }

  describe '#co2e' do
    it 'returns carbon offset in kilos' do
      expect(project.co2e).to eq(10_000)
    end
  end

  describe '#co2e_reserved' do
    it 'returns co2e reserved by invoices in kilos' do
      Invoice.create!(project: project, carbon_offset: 4)

      expect(project.co2e_reserved).to eq(4000)
    end

    it 'returns co2e resreved by climate report invoices in kilos' do
      create(:climate_report_invoice, project: project, co2e: 350)

      expect(project.co2e_reserved).to eq(350)
    end
  end

  describe '#co2e_available' do
    it 'returns project co2e minus co2e reserved in kilos' do
      Invoice.create!(project: project, carbon_offset: 4)

      expect(project.co2e_available).to eq(6000)
    end
  end
end
