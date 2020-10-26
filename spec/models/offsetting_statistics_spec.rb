# frozen_string_literal: true

require 'rails_helper'

RSpec.describe OffsettingStatistics do
  subject(:statistics) { described_class.new }

  before do |example|
    next if example.metadata[:nothing_sold]

    create(:subscription_month, co2e: 1000, price: 2000, currency: :sek)
    create(:gift_card_paid, co2e: 2000, price: 3000, currency: :sek)
    create(:flight_offset_paid, co2e: 3000, price: 4000, currency: :sek)
    create(:invoice, co2e: 4000, amount_in_sek: 5000)
    create(:climate_report_invoice, co2e: 5000, amount: 6000, currency: :sek)

    create(:gift_card, co2e: 10_000, price: 3000, currency: :sek, paid_at: nil)
    create(:flight_offset, co2e: 11_000, price: 4000, currency: :sek, paid_at: nil)
  end

  describe '.total_sold' do
    it 'sums co2e of all product types' do
      expect(statistics.total_sold).to eq(GreenhouseGases.new(15_000))
    end

    context 'when nothing is sold', nothing_sold: true do
      it 'returns 0' do
        expect(statistics.total_sold).to eq(GreenhouseGases.new(0))
      end
    end

    context 'when having been called once before' do
      before do
        statistics.total_sold
        allow(ActiveRecord::Base).to receive(:connection).and_call_original
      end

      it 'does not repeat DB queries' do
        statistics.total_sold

        expect(ActiveRecord::Base).not_to have_received(:connection)
      end
    end
  end
end
