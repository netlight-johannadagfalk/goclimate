# frozen_string_literal: true

require 'rails_helper'
require 'models/shared_example_for_receipts'

RSpec.describe FlightOffsetReceipt do
  subject(:receipt) { described_class.new(offset) }

  let(:offset) { create(:flight_offset) }

  it_behaves_like 'a receipt'

  describe '#initialize' do
    it 'initializes with provided flight offset' do
      expect(receipt.flight_offset).to be(offset)
    end
  end

  describe '#currency' do
    it 'returns Flight offset currency' do
      expect(receipt.currency).to eq(offset.charged_currency)
    end
  end

  describe '#total_amount' do
    it 'returns amount from Flight Offset' do
      offset.charged_amount = 800

      expect(receipt.total_amount).to eq(8)
    end
  end

  describe '#vat_amount' do
    it 'returns amount based on 25% VAT on charged amount in flight offset' do
      offset.charged_amount = 800

      expect(receipt.vat_amount).to eq(BigDecimal('1.60'))
    end

    it 'rounds VAT amount to nearest 2 decimals' do
      offset.charged_amount = 822

      expect(receipt.vat_amount).to eq(BigDecimal('1.64'))
    end
  end

  describe '#total_amount_before_vat' do
    it 'returns total amount minus VAT amount' do
      offset.charged_amount = 822

      expect(receipt.total_amount_before_vat).to eq(BigDecimal('6.58'))
    end
  end

  describe '#order_id' do
    it 'returns an order id' do
      expect(receipt.order_id).to eq("GCN-FLIGHT-#{offset.id}")
    end
  end
end
