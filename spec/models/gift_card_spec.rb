# frozen_string_literal: true

require 'rails_helper'
require 'shared_examples/models/types/currency_type_spec'

RSpec.describe GiftCard do
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

  include_examples 'currency attributes', [:currency]

  describe 'callback behavior' do
    context 'when new' do
      it 'sets co2e for 3 months' do
        gift_card = described_class.new(number_of_months: 3)

        expect(gift_card.co2e).to eq(GreenhouseGases.new(5_500))
      end

      it 'sets co2e for 6 months' do
        gift_card = described_class.new(number_of_months: 6)

        expect(gift_card.co2e).to eq(GreenhouseGases.new(11_000))
      end

      it 'sets price' do
        gift_card = described_class.new(number_of_months: 6, currency: :sek)
        expect(gift_card.price).to eq(Money.new(440_00, :sek))
      end

      it 'allows setting price explicitly' do
        gift_card = described_class.new(number_of_months: 1, price: 60_00, currency: :sek)

        expect(gift_card.price).to eq(Money.new(60_00, :sek))
      end

      it 'allows setting co2e explicitly' do
        gift_card = described_class.new(number_of_months: 1, co2e: 8_000)

        expect(gift_card.co2e).to eq(GreenhouseGases.new(8_000))
      end

      it 'generates a new key' do
        gift_card = described_class.create(number_of_months: 6, message: 'test')

        expect(gift_card.key).to be_present
      end

      describe 'price calculation' do
        it 'calculates price for 3 months' do
          gift_card = described_class.new(number_of_months: 3, currency: 'sek')

          # 11 tons/year * 40 kr/ton / 12 months * 2 * 3 months
          expect(gift_card.price).to eq(Money.from_amount(220, :sek))
        end

        it 'calculates price for 6 months' do
          gift_card = described_class.new(number_of_months: 6, currency: 'sek')

          # 11 tons/year * 40 kr/ton / 12 months * 2 * 6 months
          expect(gift_card.price).to eq(Money.from_amount(440, :sek))
        end

        it 'calculates price for 12 months' do
          gift_card = described_class.new(number_of_months: 12, currency: 'sek')

          # 11 tons/year * 40 kr/ton / 12 months * 2 * 6 months
          expect(gift_card.price).to eq(Money.from_amount(880, :sek))
        end

        context 'with USD' do
          it 'calculates price correctly for 1 month' do
            gift_card = described_class.new(number_of_months: 1, currency: 'usd')

            expect(gift_card.price).to eq(Money.from_amount(9, :usd))
          end

          it 'calculates price correctly for 3 months' do
            gift_card = described_class.new(number_of_months: 3, currency: 'usd')

            expect(gift_card.price).to eq(Money.from_amount(27, :usd))
          end

          it 'calculates price correctly for 6 months' do
            gift_card = described_class.new(number_of_months: 6, currency: 'usd')

            expect(gift_card.price).to eq(Money.from_amount(54, :usd))
          end

          it 'calculates price correctly for 12 months' do
            gift_card = described_class.new(number_of_months: 12, currency: 'usd')

            expect(gift_card.price).to eq(Money.from_amount(108, :usd))
          end
        end

        context 'with EUR' do
          it 'calculates price correctly for 1 month' do
            gift_card = described_class.new(number_of_months: 1, currency: 'eur')

            expect(gift_card.price).to eq(Money.from_amount(7, :eur))
          end

          it 'calculates price correctly for 3 months' do
            gift_card = described_class.new(number_of_months: 3, currency: 'eur')

            expect(gift_card.price).to eq(Money.from_amount(21, :eur))
          end

          it 'calculates price correctly for 6 months' do
            gift_card = described_class.new(number_of_months: 6, currency: 'eur')

            expect(gift_card.price).to eq(Money.from_amount(42, :eur))
          end
        end
      end
    end

    context 'when not new' do
      it 'does not overwrite key' do
        gift_card = create(:gift_card)

        expect do
          gift_card.message = 'Something else'
          gift_card.save
        end.not_to change(gift_card, :key)
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
      gift_card = described_class.new(number_of_months: 6, currency: 'eur')

      gift_card.create_payment_intent

      expect(Stripe::PaymentIntent).to have_received(:create)
        .with(hash_including(amount: gift_card.price.subunit_amount))
    end

    it 'creates a Stripe::PaymentIntent with currency' do
      gift_card = described_class.new(number_of_months: 6, currency: 'eur')

      gift_card.create_payment_intent

      expect(Stripe::PaymentIntent).to have_received(:create)
        .with(hash_including(currency: gift_card.currency.iso_code))
    end

    it 'creates Stripe payment intent with description indicating a gift card of the specified number of months' do
      gift_card = described_class.new(number_of_months: 6, currency: 'eur')

      gift_card.create_payment_intent

      expect(Stripe::PaymentIntent).to have_received(:create)
        .with(hash_including(description: 'Gift Card 6 months'))
    end

    it 'sets metadata pointing to this gift card' do
      gift_card = described_class.new(number_of_months: 6, currency: 'eur')

      gift_card.create_payment_intent

      expect(Stripe::PaymentIntent).to have_received(:create)
        .with(hash_including(metadata: hash_including(checkout_object: 'gift_card')))
    end

    it 'sets payment intent ID' do
      gift_card = described_class.new(number_of_months: 6, currency: 'eur')

      gift_card.create_payment_intent

      expect(gift_card.payment_intent_id).to eq('pi_123')
    end

    context 'when payment intent already exists' do
      subject(:gift_card) { build(:gift_card, price: 1000, currency: :sek, payment_intent_id: payment_intent.id) }

      before do
        allow(Stripe::PaymentIntent).to receive(:retrieve).and_return(payment_intent)
      end

      it 'does not create additional payment intents' do
        gift_card.create_payment_intent

        expect(Stripe::PaymentIntent).not_to have_received(:create)
      end

      context 'when existing payment intent is for an incorrect amount' do
        let(:payment_intent) do
          Stripe::PaymentIntent.construct_from(
            id: 'pi_123', object: 'payment_intent', status: 'requires_payment_method', amount: 4444, currency: 'sek'
          )
        end

        it 'raises InvalidPaymentIntent' do
          gift_card = build(:gift_card, price: 1000, currency: :sek, payment_intent_id: payment_intent.id)

          expect do
            gift_card.finalize
          end.to raise_error(GiftCard::InvalidPaymentIntent)
        end
      end

      context 'when existing payment intent is for an incorrect currency' do
        let(:payment_intent) do
          Stripe::PaymentIntent.construct_from(
            id: 'pi_123', object: 'payment_intent', status: 'requires_payment_method', amount: 1000, currency: 'xxx'
          )
        end

        it 'raises InvalidPaymentIntent' do
          gift_card = build(:gift_card, price: 1000, currency: :sek, payment_intent_id: payment_intent.id)

          expect do
            gift_card.finalize
          end.to raise_error(GiftCard::InvalidPaymentIntent)
        end
      end
    end
  end

  describe '#finalize' do
    subject(:gift_card) do
      build(:gift_card, price: 1000, currency: :sek, paid_at: nil, payment_intent_id: payment_intent.id)
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
      gift_card.finalize

      expect(gift_card.paid_at).to be_within(1.second).of(Time.now)
    end

    it 'sends confirmation email' do
      expect(GiftCardMailer).to receive_message_chain(:with, :gift_card_email, :deliver_now)

      gift_card.finalize
    end

    it 'returns true when successful' do
      expect(gift_card.finalize).to be(true)
    end

    context 'when already marked as paid' do
      subject(:gift_card) do
        build(:gift_card, price: 1000, currency: 'sek', paid_at: 1.hour.ago, payment_intent_id: payment_intent.id)
      end

      it 'returns true' do
        expect(gift_card.finalize).to be(true)
      end

      it 'does not change paid_at' do
        expect do
          gift_card.finalize
        end.not_to change(gift_card, :paid_at)
      end

      it 'does not send further emails' do
        gift_card.finalize

        expect(GiftCardMailer).not_to have_received(:with)
      end
    end

    context 'when payment intent is not yet successful' do
      let(:payment_intent) do
        Stripe::PaymentIntent.construct_from(
          id: 'pi_123', object: 'payment_intent', status: 'requires_payment_method', amount: 1000, currency: 'sek'
        )
      end

      it 'returns false' do
        expect(gift_card.finalize).to be(false)
      end

      it 'does not set paid_at' do
        gift_card.finalize

        expect(gift_card.paid_at).to be_nil
      end

      it 'does not send confirmation email' do
        gift_card.finalize

        expect(GiftCardMailer).not_to have_received(:with)
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
          gift_card.finalize
        end.to raise_error(GiftCard::InvalidPaymentIntent)
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
          gift_card.finalize
        end.to raise_error(GiftCard::InvalidPaymentIntent)
      end
    end
  end

  describe '#send_confirmation_email' do
    subject(:gift_card) { build(:gift_card, customer_email: 'customer@example.com') }

    it 'sends email to provided confirmation email recipient' do
      gift_card.send_confirmation_email

      expect(GiftCardMailer).to have_received(:with).with(hash_including(email: 'customer@example.com'))
    end

    it 'includes number of month in sent email' do
      gift_card.send_confirmation_email

      expect(GiftCardMailer).to have_received(:with)
        .with(hash_including(number_of_months: gift_card.number_of_months))
    end

    it 'includes a generated pdf in sent email' do
      gift_card.send_confirmation_email

      expect(GiftCardMailer).to have_received(:with).with(hash_including(gift_card_pdf: fake_pdf))
    end

    it 'uses gift card when generating pdf' do
      gift_card.send_confirmation_email

      expect(GiftCardCertificatePdf).to have_received(:from_gift_card).with(gift_card)
    end
  end

  describe '#key' do
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
  end

  describe '#number_of_months' do
    it 'validates number_of_months to be present' do
      gift_card = build(:gift_card)

      gift_card.number_of_months = nil

      expect(gift_card).not_to be_valid
    end
  end

  describe '#price' do
    it 'returns a Money' do
      gift_card = build(:gift_card, price: 100_00, currency: :sek)

      expect(gift_card.price).to eq(Money.new(100_00, :sek))
    end
  end

  describe '#price=' do
    it 'sets currency when provided with a Money' do
      gift_card = build(:gift_card)

      gift_card.price = Money.new(150_00, :sek)

      expect(gift_card.currency).to eq(Currency::SEK)
    end

    it 'sets price as subunit amount when provided with a Money' do
      gift_card = build(:gift_card)

      gift_card.price = Money.new(200_00, :sek)

      expect(gift_card.price_before_type_cast).to eq(200_00)
    end
  end
end
