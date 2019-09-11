# frozen_string_literal: true

require 'rails_helper'

RSpec.describe GiftCard do
  describe 'validations' do
    it 'validates key to be unique' do
      existing = create(:gift_card)

      gift_card = described_class.new(key: existing.key)

      expect(gift_card).not_to be_valid
    end

    it 'validates key to look like a SHA1 (40 hex characters)' do
      gift_card = build(:gift_card)

      gift_card.key = 'not a sha'

      expect(gift_card).not_to be_valid
    end

    it 'validates number_of_months to be present' do
      gift_card = build(:gift_card)

      gift_card.number_of_months = nil

      expect(gift_card).not_to be_valid
    end
  end

  describe 'callbacks' do
    it 'generates key when creating new gift card' do
      gift_card = described_class.create(number_of_months: 6, message: 'test')

      expect(gift_card.key).to be_present
    end

    it 'does not overwrite key when changing existing gift card' do
      gift_card = create(:gift_card)

      expect do
        gift_card.message = 'Something else'
        gift_card.save
      end.not_to change(gift_card, :key)
    end
  end

  describe '#price' do
    it 'calculates price correctly for 3 months' do
      gift_card = described_class.new(number_of_months: 3, currency: 'sek')

      # 11 tons/year * 40 kr/ton / 12 months * 2 * 3 months
      expect(gift_card.price).to eq(220)
    end

    it 'calculates price correctly for 6 months' do
      gift_card = described_class.new(number_of_months: 6, currency: 'sek')

      # 11 tons/year * 40 kr/ton / 12 months * 2 * 6 months
      expect(gift_card.price).to eq(440)
    end

    context 'with USD' do
      it 'calculates price correctly for 3 months' do
        gift_card = described_class.new(number_of_months: 3, currency: 'usd')

        expect(gift_card.price).to eq(27)
      end

      it 'calculates price correctly for 6 months' do
        gift_card = described_class.new(number_of_months: 6, currency: 'usd')

        expect(gift_card.price).to eq(54)
      end
    end

    context 'with EUR' do
      it 'calculates price correctly for 3 months' do
        gift_card = described_class.new(number_of_months: 3, currency: 'eur')

        expect(gift_card.price).to eq(21)
      end

      it 'calculates price correctly for 6 months' do
        gift_card = described_class.new(number_of_months: 6, currency: 'eur')

        expect(gift_card.price).to eq(42)
      end
    end
  end

  describe '#create_payment_intent' do
    let(:payment_intent) { Stripe::PaymentIntent.construct_from(id: 'pi_123', object: 'payment_intent') }

    before do
      allow(Stripe::PaymentIntent).to receive(:create).and_return(payment_intent)
    end

    it 'creates a Stripe::PaymentIntent with amount and currency' do
      gift_card = described_class.new(number_of_months: 6, currency: 'eur')

      gift_card.create_payment_intent

      expect(Stripe::PaymentIntent).to have_received(:create)
        .with(hash_including(amount: gift_card.price * 100, currency: gift_card.currency))
    end
  end
end
