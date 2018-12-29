# frozen_string_literal: true

require 'rails_helper'
require 'gift_cards_checkout'

RSpec.describe GiftCardsCheckout do
  let(:gift_card) { GiftCard.new(number_of_months: 3, currency: 'sek') }

  describe '#initialize' do
    it 'uses provided token and subscription months to gift' do
      checkout = GiftCardsCheckout.new('token', gift_card)

      expect(checkout.stripe_token).to eq('token')
      expect(checkout.gift_card).to eq(gift_card)
    end
  end

  describe '#checkout' do
    subject { GiftCardsCheckout.new('token', gift_card) }

    before do
      allow(Stripe::Charge).to receive(:create)
        .and_return(instance_double(Stripe::Charge))
    end

    it 'creates Stripe charge with the provided token' do
      subject.checkout

      expect(Stripe::Charge).to have_received(:create)
        .with(hash_including(source: 'token'))
    end

    it 'creates Stripe charge with gift card price as the amount' do
      subject.checkout

      expect(Stripe::Charge).to have_received(:create)
        .with(hash_including(amount: gift_card.price * 100))
    end

    it 'creates Stripe charge with gift card currency as the currency' do
      subject.checkout

      expect(Stripe::Charge).to have_received(:create)
        .with(hash_including(currency: gift_card.currency))
    end

    it 'creates Stripe charge with description indicating a gift card of the specified number of months' do
      subject.checkout

      expect(Stripe::Charge).to have_received(:create)
        .with(hash_including(description: 'Gift Card 3 months'))
    end
  end
end
