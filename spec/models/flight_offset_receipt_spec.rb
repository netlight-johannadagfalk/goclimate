# frozen_string_literal: true

require 'rails_helper'

RSpec.describe FlightOffsetReceipt do
  subject(:receipt) { described_class.new(flight_offset) }

  let(:flight_offset) { create(:flight_offset) }

  describe '#initialize' do
    it 'initializes with provided flight offset' do
      receipt = described_class.new(flight_offset)

      expect(receipt.flight_offset).to be(flight_offset)
    end
  end

  describe '#date' do
    it 'returns a date' do
      expect(receipt.date).to be_a(Date)
    end

    it 'uses FlightOffset object created_at for returned date' do
      expect(receipt.date).to eq(flight_offset.created_at.to_date)
    end
  end

  describe '#currency' do
    it 'returns Flight offset currency' do
      expect(receipt.currency).to eq(flight_offset.charged_currency)
    end
  end

  describe '#total_amount' do
    it 'returns a BigDecimal' do
      expect(receipt.total_amount).to be_a(BigDecimal)
    end

    it 'returns amount from Flight Offset' do
      flight_offset.charged_amount = 800

      expect(receipt.total_amount).to eq(8)
    end
  end

  describe '#vat_amount' do
    it 'returns a BigDecimal' do
      expect(receipt.total_amount).to be_a(BigDecimal)
    end

    it 'returns amount based on 25% VAT on charged amount in flight offset' do
      flight_offset.charged_amount = 800

      expect(receipt.vat_amount).to eq(BigDecimal('1.60'))
    end

    it 'rounds VAT amount to nearest 2 decimals' do
      flight_offset.charged_amount = 822

      expect(receipt.vat_amount).to eq(BigDecimal('1.64'))
    end
  end

  describe '#total_amount_before_vat' do
    it 'returns a BigDecimal' do
      expect(receipt.total_amount).to be_a(BigDecimal)
    end

    it 'returns total amount minus VAT amount' do
      flight_offset.charged_amount = 822

      expect(receipt.total_amount_before_vat).to eq(BigDecimal('6.58'))
    end
  end
end
