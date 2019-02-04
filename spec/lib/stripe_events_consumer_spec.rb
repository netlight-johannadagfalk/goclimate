# frozen_string_literal: true

require 'rails_helper'
require 'stripe_events_consumer'

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
      end.to change(StripeEvent, :count).by 1
    end
  end

  describe '#process' do
    let(:user) { create(:user, stripe_customer_id: 'customer_test_id') }

    describe 'with charge event' do
      let(:paid_charge_event) { Stripe::Event.construct_from(stripe_json_fixture('paid_charge_event.json')) }

      it 'creates a StripeEvent' do
        consumer.process(paid_charge_event)

        expect(StripeEvent.last.stripe_event_id).to eq('test_charge_id')
      end

      it 'sets gift card flag to false' do
        consumer.process(paid_charge_event)

        expect(StripeEvent.last.gift_card).to eq(false)
      end

      it 'does not create duplicate events when called twice' do
        consumer.process(paid_charge_event)
        consumer.process(paid_charge_event)

        expect(StripeEvent.count).to eq(1)
      end

      context 'when 1 existing paid charge already exists' do
        before do
          create(
            :stripe_event,
            stripe_customer_id: 'customer_test_id',
            paid: true,
            stripe_object: 'charge',
            currency: 'usd'
          )
        end

        it 'sends one more month email' do
          expect(SubscriptionMailer).to receive_message_chain(:with, :one_more_month_email, :deliver_now)
            .and_return(SubscriptionMailer.with(email: user.email))

          consumer.process(paid_charge_event)
        end
      end

      context 'when 11 existing paid charges already exist' do
        before do
          create_list(
            :stripe_event,
            11,
            stripe_customer_id: 'customer_test_id',
            paid: true,
            stripe_object: 'charge',
            currency: 'usd'
          )
        end

        it 'sends one more year email' do
          expect(SubscriptionMailer).to receive_message_chain(:with, :one_more_year_email, :deliver_now)
            .and_return(SubscriptionMailer.with(email: user.email))

          consumer.process(paid_charge_event)
        end
      end

      context 'with gift card charge event' do
        let(:gift_card_charge_event) do
          Stripe::Event.construct_from(stripe_json_fixture('gift_card_charge_event.json'))
        end

        it 'creates a gift card StripeEvent' do
          consumer.process(gift_card_charge_event)

          expect(StripeEvent.count).to eq(1)
        end

        it 'sets gift card flag to true' do
          consumer.process(gift_card_charge_event)

          expect(StripeEvent.last.gift_card).to eq(true)
        end

        it 'sets stripe event id' do
          consumer.process(gift_card_charge_event)

          expect(StripeEvent.last.stripe_event_id).to eq('ch_1DSOhfHwuhGySQCdlVpJYYwn')
        end

        it 'does not set stripe customer id' do
          consumer.process(gift_card_charge_event)

          expect(StripeEvent.last.stripe_customer_id).to eq(nil)
        end
      end

      context 'when Stripe returns list including unpaid charge' do
        let(:unpaid_charge_event) { Stripe::Event.construct_from(stripe_json_fixture('unpaid_charge_event.json')) }

        it 'creates a StripeEvent' do
          consumer.process(unpaid_charge_event)

          expect(StripeEvent.last.stripe_event_id).to eq('test_charge_id_2')
        end
      end

      context 'when Stripe returns list including event with no Stripe customer' do
        let(:paid_charge_event_no_customer) do
          Stripe::Event.construct_from(stripe_json_fixture('paid_charge_event_no_customer.json'))
        end

        it 'does not send email' do
          expect do
            consumer.process(paid_charge_event_no_customer)
          end.not_to(change { ActionMailer::Base.deliveries.count })
        end
      end
    end

    describe 'with subscription event' do
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
  end
end
