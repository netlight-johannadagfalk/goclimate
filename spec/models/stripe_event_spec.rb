# frozen_string_literal: true

require 'rails_helper'

RSpec.describe StripeEvent do
  describe '#update_events' do
    let(:user) do
      create(:user, stripe_customer_id: 'customer_test_id')
    end

    before do
      allow(Stripe::Event).to receive(:list).and_return(stripe_json_fixture('stripe_events_list_paid_charge.json'))
    end

    it 'creates a StripeEvent for event in Stripe' do
      StripeEvent.update_events

      expect(StripeEvent.last.stripe_event_id).to eq('test_charge_id')
      expect(StripeEvent.last.gift_card).to eq(false)
    end

    it 'does not create duplicate events when called twice' do
      StripeEvent.update_events
      StripeEvent.update_events

      expect(StripeEvent.count).to eq(1)
    end

    context 'when Stripe returns list including gift card' do
      before do
        allow(Stripe::Event).to receive(:list).and_return(stripe_json_fixture('stripe_events_list_gift_card.json'))
      end

      it 'creates a gift card StripeEvent' do
        StripeEvent.update_events

        expect(StripeEvent.count).to eq(1)
        expect(StripeEvent.last.stripe_event_id).to eq('ch_1DSOhfHwuhGySQCdlVpJYYwn')
        expect(StripeEvent.last.gift_card).to eq(true)
        expect(StripeEvent.last.stripe_customer_id).to eq(nil)
      end
    end

    context 'when Stripe returns list including unpaid charge' do
      before do
        allow(Stripe::Event).to receive(:list).and_return(stripe_json_fixture('stripe_events_list_unpaid_charge.json'))
      end

      it 'creates a StripeEvent' do
        StripeEvent.update_events

        expect(StripeEvent.last.stripe_event_id).to eq('test_charge_id_2')
      end
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

        StripeEvent.update_events

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

        StripeEvent.update_events

        expect(StripeEvent.count).to eq(12)
      end
    end

    context 'when Stripe returns list including event with no Stripe customer' do
      before do
        allow(Stripe::Event).to receive(:list)
          .and_return(stripe_json_fixture('stripe_events_list_no_stripe_customer.json'))
      end

      it 'does not send email' do
        expect(SubscriptionMailer).not_to receive(:with)
        emails = ActionMailer::Base.deliveries.count

        StripeEvent.update_events

        expect(ActionMailer::Base.deliveries.count).to eq(emails)
      end
    end
  end
end
