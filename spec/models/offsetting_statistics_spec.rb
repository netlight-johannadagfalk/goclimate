# frozen_string_literal: true

require 'rails_helper'

RSpec.describe OffsettingStatistics do
  subject(:statistics) { described_class.new }

  before do |example|
    next if example.metadata[:nothing_sold]

    create(:subscription_month, co2e: 1000, price: 2000, currency: :sek, start_at: Time.parse('2020-10-05 14:00'))
    create(:gift_card_paid, co2e: 2000, price: 3000, currency: :sek, paid_at: Time.parse('2020-10-15 14:00'))
    create(:flight_offset_paid, co2e: 3000, price: 4000, currency: :sek, paid_at: Time.parse('2020-10-20 14:00'))
    create(:invoice, co2e: 4000, amount_in_sek: 5000, created_at: Time.parse('2020-08-03 14:00'))
    create(:climate_report_invoice, co2e: 5000, amount: 6000, currency: :sek, created_at: Time.parse('2020-08-04 14:00'))

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

  describe 'sold_offsetting_per_month' do
    it 'returns a breakdown of sold offsetting per month' do # rubocop:disable RSpec/ExampleLength
      expect(statistics.sold_offsetting_per_month).to include(
        '2020-10' => hash_including(
          subscription_months_co2e: GreenhouseGases.new(1000),
          subscription_months_count: 1,
          gift_cards_co2e: GreenhouseGases.new(2000),
          gift_cards_count: 1,
          flight_offsets_co2e: GreenhouseGases.new(3000),
          flight_offsets_count: 1
        ),
        '2020-08' => hash_including(
          invoices_co2e: GreenhouseGases.new(4000),
          invoices_count: 1,
          climate_report_invoices_co2e: GreenhouseGases.new(5000),
          climate_report_invoices_count: 1
        )
      )
    end

    it 'returns consecutive months for the full period' do
      expect(statistics.sold_offsetting_per_month.keys).to eq(%w[2020-08 2020-09 2020-10])
    end

    it 'adds co2e totals for each month' do
      expect(statistics.sold_offsetting_per_month).to include(
        '2020-10' => hash_including(
          total_co2e: GreenhouseGases.new(6000)
        ),
        '2020-09' => hash_including(
          total_co2e: GreenhouseGases.new(0)
        ),
        '2020-08' => hash_including(
          total_co2e: GreenhouseGases.new(9000)
        )
      )
    end
  end
end
