# frozen_string_literal: true

require 'rails_helper'

RSpec.describe FlightOffset do
  let(:fake_pdf) { 'fake pdf' }
  let(:pdf_generator_stub) do
    instance_double(FlightOffsetCertificatePdf).tap do |pdf_generator|
      allow(pdf_generator).to receive(:render).and_return(fake_pdf)
    end
  end

  before do
    allow(FlightOffsetCertificatePdf).to receive(:new).and_return(pdf_generator_stub)
    allow(FlightOffsetMailer).to receive_message_chain(:with, :flight_offset_email, :deliver_now)
  end

  describe 'callbacks' do
    context 'when new' do
      it 'sets price' do
        offset = described_class.new(co2e: 1200, currency: :sek)

        expect(offset.price).to eq(Money.new(48_00, :sek))
      end

      it 'allows setting price explicitly' do
        offset = described_class.new(co2e: 1200, price: 60_00, currency: :sek)

        expect(offset.price).to eq(Money.new(60_00, :sek))
      end
    end
  end

  describe '#create_payment_intent' do
    let(:payment_intent) do
      Stripe::PaymentIntent.construct_from(id: 'pi_123', object: 'payment_intent', amount: 1000, currency: 'sek')
    end

    before do
      allow(Stripe::PaymentIntent).to receive(:create).and_return(payment_intent)
    end

    it 'creates a Stripe::PaymentIntent with amount' do
      offset = described_class.new(co2e: 1000, currency: 'eur')

      offset.create_payment_intent

      expect(Stripe::PaymentIntent).to have_received(:create)
        .with(hash_including(amount: offset.price.subunit_amount))
    end

    it 'creates a Stripe::PaymentIntent with currency' do
      offset = described_class.new(co2e: 1000, currency: 'eur')

      offset.create_payment_intent

      expect(Stripe::PaymentIntent).to have_received(:create)
        .with(hash_including(currency: offset.currency.iso_code))
    end

    it 'creates Stripe payment intent with description indicating a gift card of the specified number of months' do
      offset = described_class.new(co2e: 1000, currency: 'eur')

      offset.create_payment_intent

      expect(Stripe::PaymentIntent).to have_received(:create)
        .with(hash_including(description: 'Flight offset'))
    end

    it 'sets metadata pointing to this flight offset' do
      offset = described_class.new(co2e: 1000, currency: 'eur')

      offset.create_payment_intent

      expect(Stripe::PaymentIntent).to have_received(:create)
        .with(hash_including(metadata: hash_including(checkout_object: 'flight_offset')))
    end

    it 'sets payment intent ID' do
      offset = described_class.new(co2e: 1000, currency: 'eur')

      offset.create_payment_intent

      expect(offset.payment_intent_id).to eq('pi_123')
    end

    context 'when payment intent already exists' do
      subject(:offset) { build(:flight_offset, price: 1000, currency: :sek, payment_intent_id: payment_intent.id) }

      before do
        allow(Stripe::PaymentIntent).to receive(:retrieve).and_return(payment_intent)
      end

      it 'does not create additional payment intents' do
        offset.create_payment_intent

        expect(Stripe::PaymentIntent).not_to have_received(:create)
      end

      context 'when existing payment intent is for an incorrect amount' do
        let(:payment_intent) do
          Stripe::PaymentIntent.construct_from(
            id: 'pi_123', object: 'payment_intent', status: 'requires_payment_method', amount: 4444, currency: 'sek'
          )
        end

        it 'raises InvalidPaymentIntentError' do
          offset = build(:flight_offset, price: 1000, currency: :sek, payment_intent_id: payment_intent.id)

          expect do
            offset.create_payment_intent
          end.to raise_error(FlightOffset::InvalidPaymentIntentError)
        end
      end

      context 'when existing payment intent is for an incorrect currency' do
        let(:payment_intent) do
          Stripe::PaymentIntent.construct_from(
            id: 'pi_123', object: 'payment_intent', status: 'requires_payment_method', amount: 1000, currency: 'xxx'
          )
        end

        it 'raises InvalidPaymentIntentError' do
          offset = build(:flight_offset, price: 1000, currency: :sek, payment_intent_id: payment_intent.id)

          expect do
            offset.create_payment_intent
          end.to raise_error(FlightOffset::InvalidPaymentIntentError)
        end
      end
    end
  end

  describe '#finalize' do
    subject(:offset) do
      build(:flight_offset, price: 1000, currency: :sek, paid_at: nil, payment_intent_id: payment_intent.id)
    end

    let(:payment_intent) do
      Stripe::PaymentIntent.construct_from(
        id: 'pi_123', object: 'payment_intent', status: 'succeeded', amount: 1000, currency: 'sek'
      )
    end

    before do
      allow(Stripe::PaymentIntent).to receive(:retrieve).and_return(payment_intent)
    end

    it 'sets paid_at to now' do
      offset.finalize

      expect(offset.paid_at).to be_within(1.second).of(Time.now)
    end

    it 'sends confirmation email' do
      expect(FlightOffsetMailer).to receive_message_chain(:with, :flight_offset_email, :deliver_now)

      offset.finalize
    end

    it 'returns true when successful' do
      expect(offset.finalize).to be(true)
    end

    context 'when already marked as paid' do
      subject(:offset) do
        build(:flight_offset, price: 1000, currency: 'sek', paid_at: 1.hour.ago, payment_intent_id: payment_intent.id)
      end

      it 'returns true' do
        expect(offset.finalize).to be(true)
      end

      it 'does not change paid_at' do
        expect do
          offset.finalize
        end.not_to change(offset, :paid_at)
      end

      it 'does not send further emails' do
        offset.finalize

        expect(FlightOffsetMailer).not_to have_received(:with)
      end
    end

    context 'when payment intent is not yet successful' do
      let(:payment_intent) do
        Stripe::PaymentIntent.construct_from(
          id: 'pi_123', object: 'payment_intent', status: 'requires_payment_method', amount: 1000, currency: 'sek'
        )
      end

      it 'returns false' do
        expect(offset.finalize).to be(false)
      end

      it 'does not set paid_at' do
        offset.finalize

        expect(offset.paid_at).to be_nil
      end

      it 'does not send confirmation email' do
        offset.finalize

        expect(FlightOffsetMailer).not_to have_received(:with)
      end
    end

    context 'when payment intent is for an incorrect amount' do
      let(:payment_intent) do
        Stripe::PaymentIntent.construct_from(
          id: 'pi_123', object: 'payment_intent', status: 'requires_payment_method', amount: 4444, currency: 'sek'
        )
      end

      it 'raises InvalidPaymentIntent' do
        expect do
          offset.finalize
        end.to raise_error(FlightOffset::InvalidPaymentIntentError)
      end
    end

    context 'when payment intent is for an incorrect currency' do
      let(:payment_intent) do
        Stripe::PaymentIntent.construct_from(
          id: 'pi_123', object: 'payment_intent', status: 'requires_payment_method', amount: 1000, currency: 'xxx'
        )
      end

      it 'raises InvalidPaymentIntent' do
        expect do
          offset.finalize
        end.to raise_error(FlightOffset::InvalidPaymentIntentError)
      end
    end
  end

  describe '#send_confirmation_email' do
    subject(:flight_offset) { create(:flight_offset) }

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

    it 'sends confirmation email' do
      expect(FlightOffsetMailer).to receive_message_chain(:with, :flight_offset_email, :deliver_now)

      flight_offset.send_confirmation_email
    end

    it 'sets FlightOffset for mailer' do
      flight_offset.send_confirmation_email

      expect(FlightOffsetMailer).to have_received(:with).with(hash_including(flight_offset: flight_offset))
    end

    it 'includes a generated pdf in sent email' do
      flight_offset.send_confirmation_email

      expect(FlightOffsetMailer).to have_received(:with).with(hash_including(certificate_pdf: fake_pdf))
    end

    it 'uses flight offset when generating pdf' do
      flight_offset.send_confirmation_email

      expect(FlightOffsetCertificatePdf).to have_received(:new).with(flight_offset)
    end
  end

  describe '#co2e' do
    it 'validates presence' do
      flight_offset = described_class.new
      flight_offset.validate
      expect(flight_offset.errors).to have_key(:co2e)
    end
  end

  describe '#price' do
    it 'validates presence' do
      flight_offset = described_class.new
      flight_offset.validate
      expect(flight_offset.errors).to have_key(:price)
    end

    it 'returns a Money' do
      flight_offset = build(:flight_offset, price: 100_00, currency: :sek)

      expect(flight_offset.price).to eq(Money.new(100_00, :sek))
    end
  end

  describe '#price=' do
    it 'sets currency when provided with a Money' do
      flight_offset = build(:flight_offset)

      flight_offset.price = Money.new(150_00, :sek)

      expect(flight_offset.currency).to eq(Currency::SEK)
    end

    it 'sets price as subunit amount when provided with a Money' do
      flight_offset = build(:flight_offset)

      flight_offset.price = Money.new(200_00, :sek)

      expect(flight_offset.price_before_type_cast).to eq(200_00)
    end
  end

  describe '#currency' do
    it 'validates presence' do
      flight_offset = described_class.new
      flight_offset.validate
      expect(flight_offset.errors).to have_key(:currency)
    end
  end

  describe '#email' do
    it 'validates presence' do
      flight_offset = described_class.new
      flight_offset.validate
      expect(flight_offset.errors).to have_key(:email)
    end
  end

  describe '#key' do
    it 'validates key to be unique' do
      existing = create(:flight_offset, key: 'a9993e364706816aba3e25717850c26c9cd0d89d')
      flight_offset = described_class.new(key: existing.key)

      flight_offset.validate
      expect(flight_offset.errors).to have_key(:key)
    end

    it 'validates key to look like a SHA1 (40 hex characters)' do
      flight_offset = build(:flight_offset)
      flight_offset.key = 'not a sha'

      flight_offset.validate
      expect(flight_offset.errors).to have_key(:key)
    end

    it 'generates key when creating new flight offset' do
      flight_offset = create(:flight_offset)

      expect(flight_offset.key).to be_present
    end

    it 'does not overwrite key when changing existing flight offset' do
      flight_offset = create(:flight_offset)

      expect do
        flight_offset.save
      end.not_to change(flight_offset, :key)
    end
  end

  describe '#to_param' do
    it 'returns key' do
      offset = create(:flight_offset)

      expect(offset.to_param).to eq(offset.key)
    end
  end
end
