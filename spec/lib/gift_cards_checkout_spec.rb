# frozen_string_literal: true

require 'rails_helper'

RSpec.describe GiftCardsCheckout do
  let(:gift_card) { GiftCard.new(number_of_months: 3, currency: 'sek') }

  describe '#initialize' do
    it 'uses provided stripe token' do
      checkout = described_class.new('token', gift_card, 'confirmation@example.com')

      expect(checkout.stripe_token).to eq('token')
    end

    it 'uses provided gift card' do
      checkout = described_class.new('token', gift_card, 'confirmation@example.com')

      expect(checkout.gift_card).to eq(gift_card)
    end

    it 'uses provided confirmation email recipient' do
      checkout = described_class.new('token', gift_card, 'confirmation@example.com')

      expect(checkout.confirmation_email_recipient).to eq('confirmation@example.com')
    end
  end

  describe '#checkout' do
    subject(:checkout) { described_class.new('token', gift_card, 'confirmation@example.com') }

    let(:fake_pdf) { 'fake pdf' }
    let(:pdf_generator_stub) do
      instance_double(GiftCardCertificatePdfGenerator).tap do |pdf_generator|
        allow(pdf_generator).to receive(:generate_pdf).and_return(fake_pdf)
      end
    end

    before do
      allow(Stripe::Charge).to receive(:create)
        .and_return(instance_double(Stripe::Charge))
      allow(GiftCardCertificatePdfGenerator).to receive(:from_gift_card).and_return(pdf_generator_stub)
      allow(GiftCardMailer).to receive_message_chain(:with, :gift_card_email, :deliver_now)
    end

    it 'returns true when successful' do
      expect(checkout.checkout).to be true
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
          .with(hash_including(amount: gift_card.price * 100))
      end

      it 'creates Stripe charge with gift card currency as the currency' do
        checkout.checkout

        expect(Stripe::Charge).to have_received(:create)
          .with(hash_including(currency: gift_card.currency))
      end

      it 'creates Stripe charge with description indicating a gift card of the specified number of months' do
        checkout.checkout

        expect(Stripe::Charge).to have_received(:create)
          .with(hash_including(description: 'Gift Card 3 months'))
      end
    end

    describe 'confirmation email' do
      it 'sends confirmation email' do
        expect(GiftCardMailer).to receive_message_chain(:with, :gift_card_email, :deliver_now)

        checkout.checkout
      end

      it 'sends email to provided confirmation email recipient' do
        checkout.checkout

        expect(GiftCardMailer).to have_received(:with).with(hash_including(email: 'confirmation@example.com'))
      end

      it 'includes number of month in sent email' do
        checkout.checkout

        expect(GiftCardMailer).to have_received(:with)
          .with(hash_including(number_of_months: gift_card.number_of_months))
      end

      it 'includes a generated pdf in sent email' do
        checkout.checkout

        expect(GiftCardMailer).to have_received(:with).with(hash_including(gift_card_pdf: fake_pdf))
      end

      it 'uses gift card when generating pdf' do
        checkout.checkout

        expect(GiftCardCertificatePdfGenerator).to have_received(:from_gift_card).with(gift_card)
      end
    end

    context 'when card gets declined' do
      let(:card_error) do
        Stripe::CardError.new('Your card was declined.', nil, code: 'card_declined')
      end

      before do
        allow(Stripe::Charge).to receive(:create).and_raise(card_error)
      end

      it 'adds error to errors hash' do
        checkout.checkout

        expect(checkout.errors).to include(card_declined: 'Your card was declined.')
      end

      it 'does not send confirmation email' do
        checkout.checkout

        expect(GiftCardMailer).not_to have_received(:with)
      end

      it 'returns false' do
        expect(checkout.checkout).to be false
      end
    end
  end
end
