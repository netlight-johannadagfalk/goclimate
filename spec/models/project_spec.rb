# frozen_string_literal: true

require 'rails_helper'
require 'shared_examples/models/types/greenhouse_gases_type_spec'

RSpec.describe Project do
  subject(:project) { create(:project, co2e: 10_000) }

  include_examples 'greenhouse gases attributes', [:co2e]

  describe '#co2e_reserved' do
    it 'returns co2e reserved by invoices in kilos' do
      Invoice.create!(project: project, co2e: 4000)

      expect(project.co2e_reserved).to eq(GreenhouseGases.new(4000))
    end

    it 'returns co2e resreved by climate report invoices in kilos' do
      create(:climate_report_invoice, project: project, co2e: 350)

      expect(project.co2e_reserved).to eq(GreenhouseGases.new(350))
    end
  end

  describe '#co2e_available' do
    it 'returns project co2e minus co2e reserved in kilos' do
      Invoice.create!(project: project, co2e: 4000)

      expect(project.co2e_available).to eq(GreenhouseGases.new(6000))
    end
  end
end
