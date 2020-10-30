# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CardCharge do
  describe '.create_from_stripe_charge' do
    context 'with subscription charge' do
      let(:charge) { Stripe::Charge.construct_from(stripe_json_fixture('charge_subscription.json')) }
      let(:invoice) { Stripe::Invoice.construct_from(stripe_json_fixture('invoice_subscription_month.json')) }
      let!(:user) { create(:user, stripe_customer_id: charge.customer, region: Region::Europe) }

      before do
        allow(Stripe::Invoice).to receive(:retrieve).with(charge.invoice).and_return(invoice)
      end

      it 'sets gift card flag to false' do
        described_class.create_from_stripe_charge(charge)

        expect(described_class.last.gift_card).to eq(false)
      end

      it 'sets flight offset flag to false' do
        described_class.create_from_stripe_charge(charge)

        expect(described_class.last.flight_offset).to eq(false)
      end

      it 'creates a corresponding SubscriptionMonth' do
        created = described_class.create_from_stripe_charge(charge)

        expect(SubscriptionMonth.last&.payment).to eq(created)
      end

      it 'sends one more month email' do
        described_class.create_from_stripe_charge(charge)

        expect(ActionMailer::Base.deliveries.last.body.encoded)
          .to match('You have lived a climate neutral life for 1 month')
      end

      context 'when user has been climate neutral for 12 months' do
        before do
          create_list(:subscription_month, 11, user: user)
        end

        it 'sends one more year email' do
          described_class.create_from_stripe_charge(charge)

          expect(ActionMailer::Base.deliveries.last.body.encoded)
            .to match('You have lived a climate neutral life for 1 year')
        end
      end

      context 'when charge is unpaid' do
        let(:charge) { Stripe::Charge.construct_from(stripe_json_fixture('charge_subscription_unpaid.json')) }

        it 'creates a CardCharge' do
          described_class.create_from_stripe_charge(charge)

          expect(described_class.last.stripe_charge_id).to eq(charge.id)
        end

        it 'does not create a SubscriptionMonth' do
          expect do
            described_class.create_from_stripe_charge(charge)
          end.not_to change(SubscriptionMonth, :count)
        end

        it 'sends payment failed email' do
          described_class.create_from_stripe_charge(charge)

          expect(ActionMailer::Base.deliveries.last&.body&.encoded)
            .to match('Unfortunately your payment has failed')
        end
      end
    end

    context 'with gift card charge' do
      let(:charge) do
        Stripe::Charge.construct_from(stripe_json_fixture('charge_gift_card.json'))
      end

      it 'creates a gift card CardCharge' do
        described_class.create_from_stripe_charge(charge)

        expect(described_class.count).to eq(1)
      end

      it 'sets gift card flag to true' do
        described_class.create_from_stripe_charge(charge)

        expect(described_class.last.gift_card?).to eq(true)
      end

      it 'sets stripe event id' do
        described_class.create_from_stripe_charge(charge)

        expect(described_class.last.stripe_charge_id).to eq(charge.id)
      end

      it 'does not set stripe customer id' do
        described_class.create_from_stripe_charge(charge)

        expect(described_class.last.stripe_customer_id).to eq(nil)
      end
    end

    context 'with flight offset charge' do
      let(:charge) do
        Stripe::Charge.construct_from(stripe_json_fixture('charge_flight_offset.json'))
      end

      it 'creates a flight offset CardCharge' do
        described_class.create_from_stripe_charge(charge)

        expect(described_class.count).to eq(1)
      end

      it 'sets flight offset flag to true' do
        described_class.create_from_stripe_charge(charge)

        expect(described_class.last.flight_offset?).to eq(true)
      end

      it 'sets stripe event id' do
        described_class.create_from_stripe_charge(charge)

        expect(described_class.last.stripe_charge_id).to eq(charge.id)
      end

      it 'does not set stripe customer id' do
        described_class.create_from_stripe_charge(charge)

        expect(described_class.last.stripe_customer_id).to eq(nil)
      end
    end
  end
end
