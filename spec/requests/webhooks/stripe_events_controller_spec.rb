# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Webhooks::StripeEventsController do
  let(:payload) { file_fixture('stripe/webhook_charge_succeeded.json').read.chomp }
  let(:headers) do
    {
      'Stripe-Signature' => <<~TEXT,
        t=1579789490,v1=4bdc9fc09d57288a646d0f4b1bc57eff8febfc1be79bba19c02b538f39579f33,v0=8bc22207166ada2c74be3a564fe1581b8b1db08d0867a601f2153bc32d332ef6
      TEXT
      'Content-Type' => 'application/json; charset=utf-8'
    }
  end

  around do |example|
    ENV['STRIPE_WEBHOOK_SECRET'] = 'whsec_lSkvwdQkFwHioOluqFBEb0qBODKYvTAe'
    travel_to(Time.at(1_579_789_490)) { example.run }
  end

  describe 'POST /webhooks/stripe_events' do
    it 'processes successfully for valid requests' do
      post '/webhooks/stripe_events', headers: headers, params: payload

      expect(response).to have_http_status(:ok)
    end

    it 'processes event with StripeEventsConsumer' do
      consumer = StripeEventsConsumer.new
      allow(StripeEventsConsumer).to receive(:new).and_return(consumer)
      allow(consumer).to receive(:process).and_call_original

      post '/webhooks/stripe_events', headers: headers, params: payload

      expect(consumer).to have_received(:process).with(an_instance_of(Stripe::Event))
    end

    it 'returns bad request when signature is invalid' do
      post '/webhooks/stripe_events',
           headers: headers.merge('Stripe-Signature' => 't=1579789490,v1=invalid,v0=invalid'),
           params: payload

      expect(response).to have_http_status(:bad_request)
    end
  end
end
