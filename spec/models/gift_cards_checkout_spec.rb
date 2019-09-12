# frozen_string_literal: true

require 'rails_helper'

RSpec.describe GiftCardsCheckout do
  let(:gift_card) { GiftCard.new(number_of_months: 3, currency: 'sek') }

  let(:payment_intent) do
    Stripe::PaymentIntent.construct_from(
      id: 'pi_123',
      object: 'payment_intent',
      status: 'succeeded'
    )
  end

  before do
    allow(Stripe::PaymentIntent).to receive(:retrieve).and_return(payment_intent)
  end

  describe '#initialize' do
    it 'retrieves payment intent for provided id' do
      described_class.new('pi_123', gift_card, 'confirmation@example.com')

      expect(Stripe::PaymentIntent).to have_received(:retrieve).with('pi_123')
    end

    it 'sets retrieved payment intent' do
      checkout = described_class.new('pi_123', gift_card, 'confirmation@example.com')

      expect(checkout.payment_intent).to eq(payment_intent)
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

  describe '#finalize_checkout!' do
    subject(:checkout) { described_class.new('token', gift_card, 'confirmation@example.com') }

    let(:fake_pdf) { 'fake pdf' }
    let(:pdf_generator_stub) do
      instance_double(GiftCardCertificatePdf).tap do |pdf_generator|
        allow(pdf_generator).to receive(:render).and_return(fake_pdf)
      end
    end

    before do
      allow(GiftCardCertificatePdf).to receive(:from_gift_card).and_return(pdf_generator_stub)
      allow(GiftCardMailer).to receive_message_chain(:with, :gift_card_email, :deliver_now)
    end

    it 'returns true when successful' do
      expect(checkout.finalize_checkout!).to be true
    end

    describe 'confirmation email' do
      it 'sends confirmation email' do
        expect(GiftCardMailer).to receive_message_chain(:with, :gift_card_email, :deliver_now)

        checkout.finalize_checkout!
      end

      it 'sends email to provided confirmation email recipient' do
        checkout.finalize_checkout!

        expect(GiftCardMailer).to have_received(:with).with(hash_including(email: 'confirmation@example.com'))
      end

      it 'includes number of month in sent email' do
        checkout.finalize_checkout!

        expect(GiftCardMailer).to have_received(:with)
          .with(hash_including(number_of_months: gift_card.number_of_months))
      end

      it 'includes a generated pdf in sent email' do
        checkout.finalize_checkout!

        expect(GiftCardMailer).to have_received(:with).with(hash_including(gift_card_pdf: fake_pdf))
      end

      it 'uses gift card when generating pdf' do
        checkout.finalize_checkout!

        expect(GiftCardCertificatePdf).to have_received(:from_gift_card).with(gift_card)
      end
    end

    context 'when email is invalid' do
      subject(:checkout) { described_class.new('token', gift_card, 'notanemail') }

      it 'adds email error to errors hash' do
        checkout.finalize_checkout! rescue nil

        expect(checkout.errors).to include(email_invalid: 'Email is not valid.')
      end

      it 'does not send confirmation email' do
        checkout.finalize_checkout! rescue nil

        expect(GiftCardMailer).not_to have_received(:with)
      end

      it 'raises error' do
        expect do
          checkout.finalize_checkout!
        end.to raise_error(GiftCardsCheckout::ValidationError)
      end
    end

    context 'when card payment intent was not successful' do
      let(:payment_intent) do
        Stripe::PaymentIntent.construct_from(
          id: 'pi_123',
          object: 'payment_intent',
          status: 'requires_action'
        )
      end

      it 'adds error to errors hash' do
        checkout.finalize_checkout! rescue nil

        expect(checkout.errors).to include(payment_failed: 'Payment failed. Please try again.')
      end

      it 'does not send confirmation email' do
        checkout.finalize_checkout! rescue nil

        expect(GiftCardMailer).not_to have_received(:with)
      end

      it 'raises error' do
        expect do
          checkout.finalize_checkout!
        end.to raise_error(GiftCardsCheckout::ValidationError)
      end
    end
  end
end
