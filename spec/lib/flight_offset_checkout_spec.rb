# frozen_string_literal: true

require 'rails_helper'

RSpec.describe FlightOffsetCheckout do
  describe '#initialize' do
    it 'uses provided stripe token' do
      checkout = described_class.new('token', 4000, 'SEK')

      expect(checkout.source).to eq('token')
    end

    it 'uses provided amount' do
      checkout = described_class.new('token', 4000, 'SEK')

      expect(checkout.amount).to eq(4000)
    end

    it 'uses provided currency' do
      checkout = described_class.new('token', 4000, 'SEK')

      expect(checkout.currency).to eq('sek')
    end
  end

  describe '#checkout' do
    subject(:checkout) { described_class.new('token', 4000, 'SEK') }

    let(:stripe_charge) { instance_double(Stripe::Charge) }

    before do
      allow(Stripe::Charge).to receive(:create).and_return(stripe_charge)
    end

    it 'returns true when successful' do
      expect(checkout.checkout).to be true
    end

    it 'sets charge to received Stripe::Charge' do
      checkout.checkout

      expect(checkout.charge).to eq(stripe_charge)
    end

    describe 'Stripe charges' do
      it 'creates Stripe charge with the provided token' do
        checkout.checkout

        expect(Stripe::Charge).to have_received(:create)
          .with(hash_including(source: 'token'))
      end

      it 'creates Stripe charge with gift card price as the amount' do
        checkout.checkout

        expect(Stripe::Charge).to have_received(:create)
          .with(hash_including(amount: 4000))
      end

      it 'creates Stripe charge with gift card currency as the currency' do
        checkout.checkout

        expect(Stripe::Charge).to have_received(:create)
          .with(hash_including(currency: 'sek'))
      end

      it 'creates Stripe charge with description indicating a gift card of the specified number of months' do
        checkout.checkout

        expect(Stripe::Charge).to have_received(:create)
          .with(hash_including(description: 'Flight offset'))
      end
    end

    context 'when card gets declined' do
      let(:card_error) do
        Stripe::CardError.new('Your card was declined.', nil, 'card_declined')
      end

      before do
        allow(Stripe::Charge).to receive(:create).and_raise(card_error)
      end

      it 'adds error to errors hash' do
        checkout.checkout

        expect(checkout.errors).to include(card_declined: 'Your card was declined.')
      end

      it 'returns false' do
        expect(checkout.checkout).to be false
      end
    end
  end
end
