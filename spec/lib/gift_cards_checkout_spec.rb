# frozen_string_literal: true

require 'rails_helper'
require 'gift_cards_checkout'
require 'gift_card_certificate_pdf_generator'

RSpec.describe GiftCardsCheckout do
  let(:gift_card) { GiftCard.new(number_of_months: 3, currency: 'sek') }

  describe '#initialize' do
    it 'uses provided attributes' do
      checkout = GiftCardsCheckout.new('token', gift_card, 'confirmation@example.com')

      expect(checkout.stripe_token).to eq('token')
      expect(checkout.gift_card).to eq(gift_card)
      expect(checkout.confirmation_email_recipient).to eq('confirmation@example.com')
    end
  end

  describe '#checkout' do
    subject { GiftCardsCheckout.new('token', gift_card, 'confirmation@example.com') }

    let(:fake_pdf) { 'fake pdf' }
    let(:pdf_generator_stub) do
      instance_double(GiftCardCertificatePDFGenerator).tap do |pdf_generator|
        allow(pdf_generator).to receive(:generate_pdf).and_return(fake_pdf)
      end
    end

    before do
      allow(Stripe::Charge).to receive(:create)
        .and_return(instance_double(Stripe::Charge))
      allow(GiftCardCertificatePDFGenerator).to receive(:from_gift_card).and_return(pdf_generator_stub)
      allow(GiftCardMailer).to receive_message_chain(:with, :gift_card_email, :deliver_now)
    end

    describe 'Stripe charges' do
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

    describe 'confirmation email' do
      it 'sends confirmation email' do
        expect(GiftCardMailer).to receive_message_chain(:with, :gift_card_email, :deliver_now)

        subject.checkout
      end

      it 'sends email to provided confirmation email recipient' do
        subject.checkout

        expect(GiftCardMailer).to have_received(:with).with(hash_including(email: 'confirmation@example.com'))
      end

      it 'includes number of month in sent email' do
        subject.checkout

        expect(GiftCardMailer).to have_received(:with)
          .with(hash_including(number_of_months: gift_card.number_of_months))
      end

      it 'includes a generated pdf in sent email' do
        subject.checkout

        expect(GiftCardMailer).to have_received(:with).with(hash_including(gift_card_pdf: fake_pdf))
      end

      it 'uses gift card when generating pdf' do
        subject.checkout

        expect(GiftCardCertificatePDFGenerator).to have_received(:from_gift_card).with(gift_card)
      end
    end
  end
end
