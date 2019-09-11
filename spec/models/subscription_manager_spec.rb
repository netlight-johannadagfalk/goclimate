# frozen_string_literal: true

require 'rails_helper'

RSpec.describe SubscriptionManager do
  subject(:manager) { described_class.new }

  let(:plan) { Stripe::Plan.construct_from(stripe_json_fixture('plan.json')) }
  let(:payment_method_id) { 'src_CARD' }
  let(:stripe_customer_id) { 'cus_ELE17RRqbrH5tx' }
  let(:email) { 'test@example.com' }
  let(:created_subscription) do
    Stripe::Subscription.construct_from(stripe_json_fixture('subscription.json'))
  end

  before do
    allow(Stripe::Customer).to receive(:create).and_return(
      Stripe::Customer.construct_from(stripe_json_fixture('customer.json'))
    )
    allow(Stripe::Customer).to receive(:update)
    allow(Stripe::PaymentMethod).to receive(:attach)
    allow(Stripe::Subscription).to receive(:create).and_return(created_subscription)
    allow(Stripe::Subscription).to receive(:update).and_return(created_subscription)
  end

  describe '.sign_up' do
    it 'returns true indicating success' do
      expect(manager.sign_up(email, plan, payment_method_id)).to be(true)
    end

    it 'creates a new customer' do
      manager.sign_up(email, plan, payment_method_id)

      expect(Stripe::Customer).to have_received(:create)
    end

    it 'sets email for new customer' do
      manager.sign_up(email, plan, payment_method_id)

      expect(Stripe::Customer).to have_received(:create).with hash_including(email: email)
    end

    it 'sets payment_method as customer default_payment_method' do
      manager.sign_up(email, plan, payment_method_id)

      expect(Stripe::Customer).to have_received(:update)
        .with(stripe_customer_id, hash_including(invoice_settings: { default_payment_method: payment_method_id }))
    end

    it 'attaches payment_method to customer' do
      manager.sign_up(email, plan, payment_method_id)

      expect(Stripe::PaymentMethod).to have_received(:attach)
        .with(payment_method_id, hash_including(customer: stripe_customer_id))
    end

    it 'creates new subscription' do
      manager.sign_up(email, plan, payment_method_id)

      expect(Stripe::Subscription).to have_received(:create)
    end

    it 'uses created customer for new subscription' do
      manager.sign_up(email, plan, payment_method_id)

      expect(Stripe::Subscription).to have_received(:create).with hash_including(customer: manager.customer.id)
    end

    it 'uses provided plan for new subscription' do
      manager.sign_up(email, plan, payment_method_id)

      expect(Stripe::Subscription).to have_received(:create).with hash_including(plan: plan.id)
    end

    context 'when new subscription is incomplete and requires_action' do
      let(:created_subscription) do
        Stripe::Subscription.construct_from(stripe_json_fixture('subscription_requires_action.json'))
      end
      let(:client_secret) { 'c_secret' }

      it 'returns false indicating further action is needed' do
        expect(manager.sign_up(email, plan, payment_method_id)).to be(false)
      end

      it 'sets payment_intent_client_secret' do
        manager.sign_up(email, plan, payment_method_id)

        expect(manager.payment_intent_client_secret).to eq(client_secret)
      end
    end
  end

  context 'when customer already exists' do
    subject(:manager) { described_class.for_customer(stripe_customer) }

    let(:customer_id) { 'cus_EXISTING' }
    let(:stripe_customer) do
      Stripe::Customer.construct_from(stripe_json_fixture('customer_with_subscription.json'))
    end
    let(:stripe_subscription) { stripe_customer.subscriptions.first }

    describe '#for_customer' do
      it 'returns an instance' do
        expect(described_class.for_customer(stripe_customer)).to be_an_instance_of(described_class)
      end

      it 'sets provided customer' do
        manager = described_class.for_customer(stripe_customer)

        expect(manager.customer).to be(stripe_customer)
      end
    end

    describe '#cancel' do
      before do
        allow(stripe_subscription).to receive(:delete)
      end

      it 'cancels current subscription' do
        manager.cancel

        expect(stripe_subscription).to have_received(:delete)
      end
    end

    describe '#update' do
      subject(:manager) { described_class.for_customer(stripe_customer) }

      let(:stripe_customer) { Stripe::Customer.construct_from(stripe_json_fixture('customer_with_subscription.json')) }
      let(:subscription_id) { 'sub_ELX3kRY8b7Rm9e' }
      let(:customer_id) { 'cus_ELX3rIGG1ccq1R' }
      let(:new_payment_method_id) { 'new_payment_method_id' }
      let(:new_plan) { Stripe::Plan.construct_from(stripe_json_fixture('plan_alternative.json')) }

      it 'returns true to indicate success' do
        expect(manager.update(plan)).to be(true)
      end

      context 'when new plan is same as current' do
        it 'does not update subscription' do
          manager.update(plan)

          expect(Stripe::Subscription).not_to have_received(:update)
        end

        it 'does not create new subscription' do
          manager.update(plan)

          expect(Stripe::Subscription).not_to have_received(:create)
        end
      end

      context 'when new plan is different than current' do
        it 'updates subscription with new plan and prorate false' do
          manager.update(new_plan)

          expect(Stripe::Subscription).to have_received(:update)
            .with(subscription_id, hash_including(prorate: false, plan: new_plan.id))
        end

        it 'updates card before updating subscription' do
          allow(Stripe::Customer).to receive(:update) do
            expect(Stripe::Subscription).not_to have_received(:update)
          end

          manager.update(new_plan, new_payment_method_id)
        end
      end

      context 'when customer has no existing subscription' do
        let(:stripe_customer) do
          Stripe::Customer.construct_from(stripe_json_fixture('customer.json'))
        end

        before do
          allow(Stripe::Subscription).to receive(:create).and_return(stripe_subscription)
          allow(Stripe::Customer).to receive(:update)
          allow(Stripe::PaymentMethod).to receive(:attach)
        end

        it 'creates a new subscription' do
          manager.update(new_plan)

          expect(Stripe::Subscription).to have_received(:create)
        end

        it 'sets customer for created subscription' do
          manager.update(new_plan)

          expect(Stripe::Subscription).to have_received(:create).with(hash_including(customer: stripe_customer.id))
        end

        it 'sets id for plan' do
          manager.update(new_plan)

          expect(Stripe::Subscription).to have_received(:create)
            .with(hash_including(customer: stripe_customer.id, plan: new_plan.id))
        end
      end

      context 'with payment_method_id provided' do
        it 'attaches payment method to customer' do
          manager.update(plan, new_payment_method_id)

          expect(Stripe::PaymentMethod).to have_received(:attach)
            .with(new_payment_method_id, hash_including(customer: stripe_customer.id))
        end

        it 'sets new payment method as customer default' do
          manager.update(plan, new_payment_method_id)

          expect(Stripe::Customer).to have_received(:update)
            .with(stripe_customer.id,
                  hash_including(invoice_settings: { default_payment_method: new_payment_method_id }))
        end
      end
    end
  end
end
