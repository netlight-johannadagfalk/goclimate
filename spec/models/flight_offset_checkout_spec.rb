# frozen_string_literal: true

require 'rails_helper'

RSpec.describe FlightOffsetCheckout do
  let(:payment_intent) do
    Stripe::PaymentIntent.construct_from(stripe_json_fixture('payment_intent.json'))
  end

  describe '#initialize' do
    it 'uses provided stripe payment_intent' do
      checkout = described_class.new(payment_intent: payment_intent)

      expect(checkout.payment_intent).to eq(payment_intent)
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
        payment_intent: payment_intent, amount: 4000, currency: 'SEK', co2e: co2e, email: email
      )
    end

    let(:amount) { 4000 }
    let(:currency) { 'sek' }
    let(:co2e) { 1000 }
    let(:email) { 'test@example.com' }
    let(:fake_pdf) { 'fake pdf' }
    let(:certificate_generator_stub) do
      instance_double(FlightOffsetCertificatePdf).tap do |pdf_generator|
        allow(pdf_generator).to receive(:render).and_return(fake_pdf)
      end
    end

    before do
      allow(FlightOffsetCertificatePdf).to receive(:new).and_return(certificate_generator_stub)
      allow(FlightOffsetMailer).to receive_message_chain(:with, :flight_offset_email, :deliver_now)
    end

    it 'returns true when successful' do
      expect(checkout.checkout).to be true
    end

    describe 'FlightOffset creation' do
      it 'creates a FlightOffset record' do
        checkout.checkout

        expect(checkout.offset).to be_an_instance_of(FlightOffset)
      end

      it 'sets charged amount for FlightOffset' do
        checkout.checkout

        expect(checkout.offset.charged_amount).to eq(amount)
      end

      it 'sets charged currency for FlightOffset' do
        checkout.checkout

        expect(checkout.offset.charged_currency).to eq(currency)
      end

      it 'sets created Stripe charge ID for FlightOffset' do
        checkout.checkout

        expect(checkout.offset.stripe_charge_id).to eq(payment_intent.charges.first.id)
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

      it 'uses flight offset when generating pdf' do
        checkout.checkout

        expect(FlightOffsetCertificatePdf).to have_received(:new).with(checkout.offset)
      end
    end
  end
end
