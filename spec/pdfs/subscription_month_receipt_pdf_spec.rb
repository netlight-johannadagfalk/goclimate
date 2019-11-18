# frozen_string_literal: true

require 'rails_helper'
require 'models/shared_example_for_receipts'

RSpec.describe SubscriptionMonthReceiptPdf do
  subject(:receipt) { described_class.new(charge) }

  let(:charge) { create(:card_charge_monthly) }

  it_behaves_like 'a receipt'

  describe '#initialize' do
    it 'initializes with provided stripe event' do
      receipt = described_class.new(charge)

      expect(receipt.card_charge).to be(charge)
    end
  end

  describe '#date' do
    it 'uses CardCharge object created_at for returned date' do
      expect(receipt.date).to eq(charge.created_at.to_date)
    end
  end

  describe '#currency' do
    it 'returns Stripe event currency' do
      expect(receipt.currency).to eq(charge.currency)
    end
  end

  describe '#total_amount' do
    it 'returns a BigDecimal' do
      expect(receipt.total_amount).to be_a(BigDecimal)
    end

    it 'returns amount from Stripe event' do
      charge.amount = 800

      expect(receipt.total_amount).to eq(8)
    end
  end

  describe '#vat_amount' do
    it 'returns a BigDecimal' do
      expect(receipt.total_amount).to be_a(BigDecimal)
    end

    it 'returns amount based on 25% VAT on total amount in Stripe' do
      charge.amount = 800

      expect(receipt.vat_amount).to eq(BigDecimal('1.60'))
    end

    it 'rounds VAT amount to nearest 2 decimals' do
      charge.amount = 822

      expect(receipt.vat_amount).to eq(BigDecimal('1.64'))
    end
  end

  describe '#total_amount_before_vat' do
    it 'returns a BigDecimal' do
      expect(receipt.total_amount).to be_a(BigDecimal)
    end

    it 'returns total amount minus VAT amount' do
      charge.amount = 822

      expect(receipt.total_amount_before_vat).to eq(BigDecimal('6.58'))
    end
  end

  describe '#order_id' do
    it 'returns an order id' do
      expect(receipt.order_id).to eq("GCN-MONTHLY-#{charge.id}")
    end
  end
end
