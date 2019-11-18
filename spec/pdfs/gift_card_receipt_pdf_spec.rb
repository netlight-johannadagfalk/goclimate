# frozen_string_literal: true

require 'rails_helper'
require 'models/shared_example_for_receipts'

RSpec.describe GiftCardReceiptPdf do
  subject(:receipt) { described_class.new(gift_card) }

  let(:gift_card) { create(:gift_card) }

  it_behaves_like 'a receipt'

  describe '#initialize' do
    it 'initializes with provided gift card' do
      expect(receipt.gift_card).to be(gift_card)
    end
  end

  describe '#date' do
    it 'uses gift card created_at for returned date' do
      expect(receipt.date).to eq(gift_card.created_at.to_date)
    end
  end

  describe '#currency' do
    it 'returns gift card currency' do
      expect(receipt.currency).to eq(gift_card.currency.iso_code)
    end
  end

  describe '#order_id' do
    it 'returns an order id' do
      expect(receipt.order_id).to eq("GCN-GIFT-#{gift_card.id}")
    end
  end

  describe '#totoal_amount' do
    it 'returns the correct price' do
      expect(receipt.total_amount).to eq(BigDecimal(440))
    end
  end
end
