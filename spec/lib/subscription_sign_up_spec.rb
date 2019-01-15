# frozen_string_literal: true

require 'rails_helper'
require 'subscription_sign_up'

RSpec.describe SubscriptionSignUp do
  let(:plan) { Stripe::Plan.construct_from(stripe_json_fixture('plan.json')) }
  let(:card_source) { 'src_CARD' }
  let(:email) { 'test@example.com' }
  let(:created_subscription) do
    Stripe::Subscription.construct_from(stripe_json_fixture('subscription.json'))
  end

  subject(:sign_up) do
    SubscriptionSignUp.new(plan, card_source, email)
  end

  before do
    allow(Stripe::Customer).to receive(:create).and_return(
      Stripe::Customer.construct_from(stripe_json_fixture('customer.json'))
    )
    allow(Stripe::Subscription).to receive(:create).and_return(created_subscription)
    allow(Stripe::Charge).to receive(:create).and_return(
      Stripe::Charge.construct_from(stripe_json_fixture('charge_successful_3d_secure.json'))
    )
  end

  describe '.sign_up' do
    describe 'customer creation' do
      it 'creates a new customer' do
        subject.sign_up

        expect(Stripe::Customer).to have_received(:create)
      end

      it 'sets email for new customer' do
        subject.sign_up

        expect(Stripe::Customer).to have_received(:create).with hash_including(email: email)
      end

      it 'sets source for new customer' do
        subject.sign_up

        expect(Stripe::Customer).to have_received(:create).with hash_including(source: card_source)
      end
    end

    describe 'subscription creation' do
      it 'creates new subscription' do
        subject.sign_up

        expect(Stripe::Subscription).to have_received(:create)
      end

      it 'uses created customer for new subscription' do
        subject.sign_up

        expect(Stripe::Subscription).to have_received(:create).with hash_including(customer: subject.customer.id)
      end

      it 'uses provided plan for new subscription' do
        subject.sign_up

        expect(Stripe::Subscription).to have_received(:create).with hash_including(plan: plan.id)
      end

      it 'does not perform any additional charges' do
        subject.sign_up

        expect(Stripe::Charge).to_not have_received(:create)
      end

      it 'does not set any trial period' do
        subject.sign_up

        expect(Stripe::Subscription).to_not have_received(:create).with(hash_including(:trial_end))
      end

      context 'when 3D Secure source is set' do
        let(:created_subscription) do
          Stripe::Subscription.construct_from(stripe_json_fixture('subscription_1_month_trial.json'))
        end
        let(:three_d_secure_source) { 'src_THREEDSECURE' }

        before do
          subject.three_d_secure_source = three_d_secure_source
        end

        it 'performs a first charge to the 3D Secure source' do
          subject.sign_up

          expect(Stripe::Charge).to have_received(:create)
        end

        it 'uses plan monthly cost as amount for initial charge' do
          subject.sign_up

          expect(Stripe::Charge).to have_received(:create).with hash_including(amount: plan.amount)
        end

        it 'uses plan currency as currency for initial charge' do
          subject.sign_up

          expect(Stripe::Charge).to have_received(:create).with hash_including(currency: plan.currency)
        end

        it 'uses provided 3D Secure source for initial charge' do
          subject.sign_up

          expect(Stripe::Charge).to have_received(:create).with hash_including(source: three_d_secure_source)
        end

        it 'uses created customer for initial charge' do
          subject.sign_up

          expect(Stripe::Charge).to have_received(:create).with hash_including(customer: subject.customer.id)
        end

        it 'adds 1 month trial to created subscription' do
          # We're expecting the trial end to be set relative to now so pause time to be able to match against it
          allow(Time).to receive(:now).and_return(Time.now)

          subject.sign_up

          expect(Stripe::Subscription).to have_received(:create)
            .with hash_including(trial_end: 1.month.from_now.to_i)
        end
      end
    end
  end
end
