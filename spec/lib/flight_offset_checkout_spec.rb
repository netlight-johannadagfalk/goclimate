# frozen_string_literal: true

require 'rails_helper'

RSpec.describe FlightOffsetCheckout do
  describe '#initialize' do
    it 'uses provided stripe token' do
      checkout = described_class.new(stripe_source: 'token')

      expect(checkout.stripe_source).to eq('token')
    end

    it 'uses provided amount' do
      checkout = described_class.new(amount: 4000)

      expect(checkout.amount).to eq(4000)
    end

    it 'uses provided currency' do
      checkout = described_class.new(currency: 'SEK')

      expect(checkout.currency).to eq('sek')
    end

    it 'uses provided co2e' do
      checkout = described_class.new(co2e: 1000)

      expect(checkout.co2e).to eq(1000)
    end

    it 'uses provided email' do
      checkout = described_class.new(email: 'test@example.com')

      expect(checkout.email).to eq('test@example.com')
    end
  end

  describe '#checkout' do
    subject(:checkout) do
      described_class.new(
        stripe_source: 'token', amount: 4000, currency: 'SEK', co2e: co2e, email: email
      )
    end

    let(:co2e) { 1000 }
    let(:email) { 'test@example.com' }
    let(:stripe_charge) { Stripe::Charge.construct_from(id: 'charge_id', amount: 4000, currency: 'sek') }
    let(:fake_pdf) { 'fake pdf' }
    let(:certificate_generator_stub) do
      instance_double(FlightOffsetCertificatePdfGenerator).tap do |pdf_generator|
        allow(pdf_generator).to receive(:generate_pdf).and_return(fake_pdf)
      end
    end

    before do
      allow(Stripe::Charge).to receive(:create).and_return(stripe_charge)
      allow(FlightOffsetCertificatePdfGenerator).to receive(:new).and_return(certificate_generator_stub)
      allow(FlightOffsetMailer).to receive_message_chain(:with, :flight_offset_email, :deliver_now)
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

      it 'creates Stripe charge with provided price as the amount' do
        checkout.checkout

        expect(Stripe::Charge).to have_received(:create)
          .with(hash_including(amount: 4000))
      end

      it 'creates Stripe charge with provided currency as the currency' do
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

    describe 'FlightOffset creation' do
      it 'creates a FlightOffset record' do
        checkout.checkout

        expect(checkout.offset).to be_an_instance_of(FlightOffset)
      end

      it 'sets charged amount for FlightOffset' do
        checkout.checkout

        expect(checkout.offset.charged_amount).to eq(stripe_charge.amount)
      end

      it 'sets charged currency for FlightOffset' do
        checkout.checkout

        expect(checkout.offset.charged_currency).to eq(stripe_charge.currency)
      end

      it 'sets created Stripe charge ID for FlightOffset' do
        checkout.checkout

        expect(checkout.offset.stripe_charge_id).to eq(stripe_charge.id)
      end

      it 'sets CO2e for FlightOffset' do
        checkout.checkout

        expect(checkout.offset.co2e).to eq(checkout.co2e)
      end

      it 'sets email for FlightOffset' do
        checkout.checkout

        expect(checkout.offset.email).to eq(checkout.email)
      end

      it 'persists FlightOffset record' do
        checkout.checkout

        expect(checkout.offset.persisted?).to be true
      end

      context 'when provided FlightOffset parameters are invalid' do
        let(:email) { nil }

        it 'raises error' do
          expect do
            checkout.checkout
          end.to raise_error(ActiveRecord::RecordInvalid)
        end
      end
    end

    describe 'confirmation email' do
      it 'sends confirmation email' do
        expect(FlightOffsetMailer).to receive_message_chain(:with, :flight_offset_email, :deliver_now)

        checkout.checkout
      end

      it 'sets FlightOffset for mailer' do
        checkout.checkout

        expect(FlightOffsetMailer).to have_received(:with).with(hash_including(flight_offset: checkout.offset))
      end

      it 'includes a generated pdf in sent email' do
        checkout.checkout

        expect(FlightOffsetMailer).to have_received(:with).with(hash_including(certificate_pdf: fake_pdf))
      end

      it 'uses gift card when generating pdf' do
        checkout.checkout

        expect(FlightOffsetCertificatePdfGenerator).to have_received(:new).with(checkout.offset)
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

      it 'returns false' do
        expect(checkout.checkout).to be false
      end
    end
  end
end
