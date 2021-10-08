# frozen_string_literal: true

require 'rails_helper'

RSpec.describe StripeEventsConsumer do
  subject(:consumer) { described_class.new }

  describe '#fetch_and_process' do
    before do
      allow(Stripe::Event).to receive(:list).and_return(
        Stripe::Event.construct_from(stripe_json_fixture('events_list.json'))
      )
    end

    it 'fetches and processes events' do
      expect do
        consumer.fetch_and_process
      end.to change(CardCharge, :count).by 1
    end
  end

  describe '#process' do
    describe 'charge events' do
      let(:paid_charge_event) { Stripe::Event.construct_from(stripe_json_fixture('event_charge_paid.json')) }

      it 'creates a CardCharge' do
        consumer.process(paid_charge_event)

        expect(CardCharge.count).to eq(1)
      end

      it 'does not create duplicate events when called a second time for the same charge' do
        consumer.process(paid_charge_event)
        consumer.process(paid_charge_event)

        expect(CardCharge.count).to eq(1)
      end
    end

    describe 'subscription events' do
      let(:user) { create(:user, stripe_customer_id: 'customer_test_id') }
      let(:subscription_event) do
        Stripe::Event.construct_from(stripe_json_fixture('event_subscription_deleted.json'))
      end

      before do
        user.update(stripe_customer_id: subscription_event.data.object.customer)
      end

      it 'updates user from subscription' do
        expect do
          consumer.process(subscription_event)
        end.to(change { User.find(user.id).subscription_end_at })
      end
    end

    describe 'payment intent events for gift card' do
      let(:event) { Stripe::Event.construct_from(stripe_json_fixture('event_payment_intent_successful.json')) }

      it 'does nothing if no gift card owns the payment intent' do
        expect do
          consumer.process(event)
        end.not_to raise_error
      end

      context 'when gift card exists' do
        let(:gift_card) do
          create(
            :gift_card,
            payment_intent_id: event.data.object.id,
            price_incl_taxes: event.data.object.amount,
            currency: event.data.object.currency
          )
        end

        before do
          gift_card # Trigger creation of gift card
          # Stub out slow PDF generation
          allow_any_instance_of(GiftCardCertificatePdf).to receive(:render).and_return('fake pdf') # rubocop:disable RSpec/AnyInstance
        end

        it 'finalizes Gift Card' do
          consumer.process(event)

          gift_card.reload
          expect(gift_card.paid_at).to be_present
        end
      end
    end

    describe 'payment intent events for flight offset' do
      let(:event) do
        Stripe::Event.construct_from(stripe_json_fixture('event_payment_intent_flight_offset_successful.json'))
      end

      it 'does nothing if no flight offset owns the payment intent' do
        expect do
          consumer.process(event)
        end.not_to raise_error
      end

      context 'when flight offset exists' do
        let(:offset) do
          create(
            :flight_offset,
            payment_intent_id: event.data.object.id,
            price_incl_taxes: event.data.object.amount,
            currency: event.data.object.currency
          )
        end

        before do
          offset # Trigger creation of gift card
          # Stub out slow PDF generation
          allow_any_instance_of(FlightOffsetCertificatePdf).to receive(:render).and_return('fake pdf') # rubocop:disable RSpec/AnyInstance
        end

        it 'finalizes flight offset' do
          consumer.process(event)

          offset.reload
          expect(offset.paid_at).to be_present
        end
      end
    end
  end
end
