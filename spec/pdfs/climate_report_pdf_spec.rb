# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ClimateReportPdf do
  subject(:crp) { described_class.new(climate_report) }

  let(:climate_report) { create(:climate_report) }

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
end
