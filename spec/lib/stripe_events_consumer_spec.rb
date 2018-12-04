# frozen_string_literal: true

require 'rails_helper'
require 'stripe_events_consumer'

RSpec.describe StripeEventsConsumer do
  subject { StripeEventsConsumer.new }

  describe '.fetch_and_process' do
    before do
      allow(Stripe::Event).to receive(:list).and_return(stripe_json_fixture('events_list.json'))
      allow(subject).to receive(:process)
    end

    it 'fetches and processes events' do
      subject.fetch_and_process

      expect(subject).to have_received(:process).once
    end
  end

  describe '.process' do
    let(:user) { create(:user, stripe_customer_id: 'customer_test_id') }
    let(:paid_charge_event) { stripe_json_fixture('paid_charge_event.json') }

    it 'creates a StripeEvent' do
      subject.process(paid_charge_event)

      expect(StripeEvent.last.stripe_event_id).to eq('test_charge_id')
      expect(StripeEvent.last.gift_card).to eq(false)
    end

    it 'does not create duplicate events when called twice' do
      subject.process(paid_charge_event)
      subject.process(paid_charge_event)

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

        subject.process(paid_charge_event)

        expect(StripeEvent.count).to eq(2)
        expect(StripeEvent.last.gift_card).to eq(false)
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

        subject.process(paid_charge_event)

        expect(StripeEvent.count).to eq(12)
      end
    end

    context 'with gift card charge event' do
      let(:gift_card_charge_event) { stripe_json_fixture('gift_card_charge_event.json') }

      it 'creates a gift card StripeEvent' do
        subject.process(gift_card_charge_event)

        expect(StripeEvent.count).to eq(1)
        expect(StripeEvent.last.stripe_event_id).to eq('ch_1DSOhfHwuhGySQCdlVpJYYwn')
        expect(StripeEvent.last.gift_card).to eq(true)
        expect(StripeEvent.last.stripe_customer_id).to eq(nil)
      end
    end

    context 'when Stripe returns list including unpaid charge' do
      let(:unpaid_charge_event) { stripe_json_fixture('unpaid_charge_event.json') }

      it 'creates a StripeEvent' do
        subject.process(unpaid_charge_event)

        expect(StripeEvent.last.stripe_event_id).to eq('test_charge_id_2')
      end
    end

    context 'when Stripe returns list including event with no Stripe customer' do
      let(:paid_charge_event_no_customer) { stripe_json_fixture('paid_charge_event_no_customer.json') }

      it 'does not send email' do
        expect(SubscriptionMailer).not_to receive(:with)
        emails = ActionMailer::Base.deliveries.count

        subject.process(paid_charge_event_no_customer)

        expect(ActionMailer::Base.deliveries.count).to eq(emails)
      end
    end
  end
end
