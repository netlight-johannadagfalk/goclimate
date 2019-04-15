# frozen_string_literal: true

require 'rails_helper'
require 'models/shared_example_for_receipts'

RSpec.describe SubscriptionMonthReceipt do
  subject(:receipt) { described_class.new(offset) }

  let(:offset) { create(:stripe_event_monthly) }

  it_behaves_like 'a receipt'

  describe '#initialize' do
    it 'initializes with provided stripe event' do
      receipt = described_class.new(offset)

      expect(receipt.stripe_event).to be(offset)
    end
  end

  describe '#date' do
    it 'uses StripeEvent object created_at for returned date' do
      expect(receipt.date).to eq(offset.created_at.to_date)
    end
  end

  describe '#currency' do
    it 'returns Stripe event currency' do
      expect(receipt.currency).to eq(offset.currency)
    end
  end

  describe '#total_amount' do
    it 'returns a BigDecimal' do
      expect(receipt.total_amount).to be_a(BigDecimal)
    end

    it 'returns amount from Stripe event' do
      offset.stripe_amount = 800

      expect(receipt.total_amount).to eq(8)
    end
  end

  describe '#vat_amount' do
    it 'returns a BigDecimal' do
      expect(receipt.total_amount).to be_a(BigDecimal)
    end

    it 'returns amount based on 25% VAT on total amount in Stripe' do
      offset.stripe_amount = 800

      expect(receipt.vat_amount).to eq(BigDecimal('1.60'))
    end

    it 'rounds VAT amount to nearest 2 decimals' do
      offset.stripe_amount = 822

      expect(receipt.vat_amount).to eq(BigDecimal('1.64'))
    end
  end

  describe '#total_amount_before_vat' do
    it 'returns a BigDecimal' do
      expect(receipt.total_amount).to be_a(BigDecimal)
    end

    it 'returns total amount minus VAT amount' do
      offset.stripe_amount = 822

      expect(receipt.total_amount_before_vat).to eq(BigDecimal('6.58'))
    end
  end

  describe '#order_id' do
    it 'returns an order id' do
      expect(receipt.order_id).to eq("GCN-MONTHLY-#{offset.id}")
    end
  end
end
