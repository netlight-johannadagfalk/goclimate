# frozen_string_literal: true

require 'rails_helper'
require 'models/shared_example_for_receipts'

RSpec.describe FlightOffsetReceiptPdf do
  subject(:receipt) { described_class.new(offset) }

  let(:offset) { create(:flight_offset, price_incl_taxes: 8_00, price: 6_40, vat_amount: 1_60) }

  it_behaves_like 'a receipt'

  describe '#initialize' do
    it 'initializes with provided flight offset' do
      expect(receipt.flight_offset).to be(offset)
    end
  end

  describe '#date' do
    it 'uses FlightOffset created_at for returned date' do
      expect(receipt.date).to eq(offset.created_at.to_date)
    end
  end

  describe '#currency' do
    it 'returns Flight offset currency' do
      expect(receipt.currency).to eq(offset.currency)
    end
  end

  describe '#total_amount' do
    it 'returns amount from Flight Offset' do
      expect(receipt.total_amount).to eq(8)
    end
  end

  describe '#vat_amount' do
    it 'returns amount based on 25% VAT on charged amount in flight offset' do
      expect(receipt.vat_amount).to eq(BigDecimal('1.60'))
    end
  end

  describe '#total_amount_before_vat' do
    it 'returns total amount minus VAT amount' do
      expect(receipt.total_amount_before_vat).to eq(BigDecimal('6.40'))
    end
  end

  describe '#order_id' do
    it 'returns an order id' do
      expect(receipt.order_id).to eq("GCN-FLIGHT-#{offset.id}")
    end
  end
end
