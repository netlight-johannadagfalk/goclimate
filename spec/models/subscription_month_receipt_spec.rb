# frozen_string_literal: true

require 'rails_helper'

RSpec.describe SubscriptionMonthReceipt do
  subject(:receipt) { described_class.new(stripe_event) }

  let(:stripe_event) { create(:stripe_event_monthly) }

  describe '#initialize' do
    it 'initializes with provided stripe event' do
      receipt = described_class.new(stripe_event)

      expect(receipt.stripe_event).to be(stripe_event)
    end
  end

  describe '#date' do
    it 'returns a date' do
      expect(receipt.date).to be_a(Date)
    end

    it 'uses StripeEvent object created_at for returned date' do
      expect(receipt.date).to eq(stripe_event.created_at.to_date)
    end
  end

  describe '#currency' do
    it 'returns Stripe event currency' do
      expect(receipt.currency).to eq(stripe_event.currency)
    end
  end

  describe '#total_amount' do
    it 'returns a BigDecimal' do
      expect(receipt.total_amount).to be_a(BigDecimal)
    end

    it 'returns amount from Stripe event' do
      stripe_event.stripe_amount = 800

      expect(receipt.total_amount).to eq(8)
    end
  end

  describe '#vat_amount' do
    it 'returns a BigDecimal' do
      expect(receipt.total_amount).to be_a(BigDecimal)
    end

    it 'returns amount based on 25% VAT on total amount in Stripe' do
      stripe_event.stripe_amount = 800

      expect(receipt.vat_amount).to eq(BigDecimal('1.60'))
    end

    it 'rounds VAT amount to nearest 2 decimals' do
      stripe_event.stripe_amount = 822

      expect(receipt.vat_amount).to eq(BigDecimal('1.64'))
    end
  end

  describe '#total_amount_before_vat' do
    it 'returns a BigDecimal' do
      expect(receipt.total_amount).to be_a(BigDecimal)
    end

    it 'returns total amount minus VAT amount' do
      stripe_event.stripe_amount = 822

      expect(receipt.total_amount_before_vat).to eq(BigDecimal('6.58'))
    end
  end

  describe '#order_id' do
    it 'returns an order id' do
      expect(receipt.order_id).to eq("GCN-SE-#{stripe_event.id}")
    end
  end
end
