# frozen_string_literal: true

require 'rails_helper'

RSpec.describe StripeEvent do
  before do
    @u = create(:user, stripe_customer_id: 'customer_test_id')
    allow(Stripe::Event).to receive(:list).and_return(stripe_json_fixture('stripe_events_list_paid_charge.json'))
  end

  describe '#update_events' do
    context 'when Stripe returns list including gift card' do
      before do
        allow(Stripe::Event).to receive(:list).and_return(stripe_json_fixture('stripe_events_list_gift_card.json'))
      end

      it 'inserts one StripeEvent' do
        @u = create(:user, stripe_customer_id: nil)

        StripeEvent.update_events

        expect(StripeEvent.count).to eq(1)
        expect(StripeEvent.last.stripe_event_id).to eq('ch_1DSOhfHwuhGySQCdlVpJYYwn')
        expect(StripeEvent.last.gift_card).to eq(true)
        expect(StripeEvent.last.stripe_customer_id).to eq(nil)
      end
    end

    it 'inserts one stripeevent' do
      StripeEvent.update_events

      expect(Stripe::Event).to have_received(:list).with(limit: 1000)
      expect(StripeEvent.last.stripe_event_id).to eq('test_charge_id')
      expect(StripeEvent.last.gift_card).to eq(false)
    end

    context 'when Stripe returns list including unpaid charge' do
      before do
        allow(Stripe::Event).to receive(:list).and_return(stripe_json_fixture('stripe_events_list_unpaid_charge.json'))
      end

      it 'should add a stripeevent' do
        StripeEvent.update_events

        expect(StripeEvent.last.stripe_event_id).to eq('test_charge_id_2')
      end
    end

    it 'inserts only one stripeevent even if update events is called two times' do
      StripeEvent.update_events
      StripeEvent.update_events
      expect(StripeEvent.count).to eq(1)
      expect(StripeEvent.last.gift_card).to eq(false)
    end

    it 'sends one more month email if payment is new' do
      create(:stripe_event, stripe_customer_id: 'customer_test_id', paid: true, stripe_object: 'charge', currency: 'usd')
      expect(SubscriptionMailer).to receive_message_chain(:with, :one_more_month_email, :deliver_now).and_return(SubscriptionMailer.with(email: @u.email))
      StripeEvent.update_events
      expect(StripeEvent.count).to eq(2)
      expect(StripeEvent.last.gift_card).to eq(false)
    end

    it 'sends one more year email if one year of payments has gone by' do
      create_list(:stripe_event, 11, stripe_customer_id: 'customer_test_id', paid: true, stripe_object: 'charge', currency: 'usd')
      expect(SubscriptionMailer).to receive_message_chain(:with, :one_more_year_email, :deliver_now).and_return(SubscriptionMailer.with(email: @u.email))
      StripeEvent.update_events
      expect(StripeEvent.count).to eq(12)
    end

    context 'when Stripe returns list including event with no Stripe customer' do
      before do
        allow(Stripe::Event).to receive(:list).and_return(stripe_json_fixture('stripe_events_list_no_stripe_customer.json'))
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
