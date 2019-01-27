# frozen_string_literal: true

require 'rails_helper'
require 'subscription_manager'

RSpec.describe SubscriptionManager do
  let(:plan) { Stripe::Plan.construct_from(stripe_json_fixture('plan.json')) }
  let(:card_source) { 'src_CARD' }
  let(:email) { 'test@example.com' }
  let(:created_subscription) do
    Stripe::Subscription.construct_from(stripe_json_fixture('subscription.json'))
  end

  subject(:manager) { SubscriptionManager.new }

  before do
    allow(Stripe::Customer).to receive(:create).and_return(
      Stripe::Customer.construct_from(stripe_json_fixture('customer.json'))
    )
    allow(Stripe::Subscription).to receive(:create).and_return(created_subscription)
    allow(Stripe::Charge).to receive(:create).and_return(
      Stripe::Charge.construct_from(stripe_json_fixture('charge_successful_3d_secure.json'))
    )
    allow(Stripe::Source).to receive(:retrieve).and_return(
      Stripe::Source.construct_from(stripe_json_fixture('source_three_d_secure_chargeable.json'))
    )
  end

  describe '.sign_up' do
    it 'returns true indicating success' do
      expect(subject.sign_up(email, plan, card_source)).to be(true)
    end

    describe 'customer creation' do
      it 'creates a new customer' do
        subject.sign_up(email, plan, card_source)

        expect(Stripe::Customer).to have_received(:create)
      end

      it 'sets email for new customer' do
        subject.sign_up(email, plan, card_source)

        expect(Stripe::Customer).to have_received(:create).with hash_including(email: email)
      end

      it 'sets source for new customer' do
        subject.sign_up(email, plan, card_source)

        expect(Stripe::Customer).to have_received(:create).with hash_including(source: card_source)
      end
    end

    describe 'subscription creation' do
      it 'creates new subscription' do
        subject.sign_up(email, plan, card_source)

        expect(Stripe::Subscription).to have_received(:create)
      end

      it 'uses created customer for new subscription' do
        subject.sign_up(email, plan, card_source)

        expect(Stripe::Subscription).to have_received(:create).with hash_including(customer: subject.customer.id)
      end

      it 'uses provided plan for new subscription' do
        subject.sign_up(email, plan, card_source)

        expect(Stripe::Subscription).to have_received(:create).with hash_including(plan: plan.id)
      end

      it 'does not perform any additional charges' do
        subject.sign_up(email, plan, card_source)

        expect(Stripe::Charge).to_not have_received(:create)
      end

      it 'does not set any trial period' do
        subject.sign_up(email, plan, card_source)

        expect(Stripe::Subscription).to_not have_received(:create).with(hash_including(trial_end: a_truthy_value))
      end

      context 'when encoutering card errors' do
        let(:card_error) do
          Stripe::CardError.new('Your card was declined.', nil, 'card_declined')
        end

        before do
          allow(Stripe::Subscription).to receive(:create).and_raise(card_error)
        end

        it 'adds error to errors hash' do
          subject.sign_up(email, plan, card_source)

          expect(subject.errors).to include(card_declined: 'Your card was declined.')
        end

        it 'returns false' do
          expect(subject.sign_up(email, plan, card_source)).to be false
        end
      end

      context 'when 3D Secure source is set' do
        let(:created_subscription) do
          Stripe::Subscription.construct_from(stripe_json_fixture('subscription_1_month_trial.json'))
        end
        let(:three_d_secure_source) { 'src_THREEDSECURE' }

        it 'performs a first charge to the 3D Secure source' do
          subject.sign_up(email, plan, card_source, three_d_secure_source)

          expect(Stripe::Charge).to have_received(:create)
        end

        it 'uses plan monthly cost as amount for initial charge' do
          subject.sign_up(email, plan, card_source, three_d_secure_source)

          expect(Stripe::Charge).to have_received(:create).with hash_including(amount: plan.amount)
        end

        it 'uses plan currency as currency for initial charge' do
          subject.sign_up(email, plan, card_source, three_d_secure_source)

          expect(Stripe::Charge).to have_received(:create).with hash_including(currency: plan.currency)
        end

        it 'uses provided 3D Secure source for initial charge' do
          subject.sign_up(email, plan, card_source, three_d_secure_source)

          expect(Stripe::Charge).to have_received(:create).with hash_including(source: three_d_secure_source)
        end

        it 'uses created customer for initial charge' do
          subject.sign_up(email, plan, card_source, three_d_secure_source)

          expect(Stripe::Charge).to have_received(:create).with hash_including(customer: subject.customer.id)
        end

        it 'adds 1 month trial to created subscription' do
          # We're expecting the trial end to be set relative to now so pause time to be able to match against it
          allow(Time).to receive(:now).and_return(Time.now)

          subject.sign_up(email, plan, card_source, three_d_secure_source)

          expect(Stripe::Subscription).to have_received(:create)
            .with hash_including(trial_end: 1.month.from_now.to_i)
        end

        context 'when 3D Secure source is not chargeable after verification' do
          before do
            allow(Stripe::Source).to receive(:retrieve).and_return(
              Stripe::Source.construct_from(stripe_json_fixture('source_three_d_secure_failed.json'))
            )
          end

          it 'adds error to errors hash' do
            subject.sign_up(email, plan, card_source, three_d_secure_source)

            expect(subject.errors).to include(verification_failed: 'Card verification was not successful.')
          end

          it 'does not create any stale customers in Stripe' do
            subject.sign_up(email, plan, card_source, three_d_secure_source)

            expect(Stripe::Customer).to_not have_received(:create)
          end

          it 'returns false' do
            expect(subject.sign_up(email, plan, card_source, three_d_secure_source)).to be(false)
          end
        end
      end
    end
  end

  context 'for existing customers' do
    let(:customer_id) { 'cus_EXISTING' }
    let(:stripe_customer) do
      Stripe::Customer.construct_from(stripe_json_fixture('customer_with_subscription.json'))
    end
    let(:stripe_subscription) { stripe_customer.subscriptions.first }
    subject(:manager) { SubscriptionManager.for_customer(customer_id) }

    before do
      allow(Stripe::Customer).to receive(:retrieve).and_return(stripe_customer)
    end

    describe '#for_customer' do
      it 'retrieves customer with provided customer id' do
        SubscriptionManager.for_customer(customer_id)

        expect(Stripe::Customer).to have_received(:retrieve).with(customer_id)
      end

      it 'returns an instance' do
        expect(SubscriptionManager.for_customer(customer_id)).to be_an_instance_of(SubscriptionManager)
      end

      it 'sets retrieved customer' do
        subject = SubscriptionManager.for_customer(customer_id)

        expect(subject.customer).to be(stripe_customer)
      end
    end

    describe '.cancel' do
      before do
        allow(stripe_subscription).to receive(:delete)
      end

      it 'cancels current subscription' do
        subject.cancel

        expect(stripe_subscription).to have_received(:delete)
      end
    end

    describe '.update' do
      let(:new_card_source) { Stripe::Source.construct_from(id: 'src_NEW_CARD') }
      let(:three_d_secure_source) { 'src_THREEDSECURE' }
      let(:new_plan) { Stripe::Plan.construct_from(stripe_json_fixture('plan_alternative.json')) }

      before do
        allow(stripe_customer).to receive(:save)
        allow(stripe_customer.sources).to receive(:create).and_return(new_card_source)
        allow(stripe_subscription).to receive(:save) if stripe_subscription.present?
      end

      it 'returns true to indicate success' do
        expect(subject.update(plan)).to be(true)
      end

      context 'when new plan is same as current' do
        it 'does not update subscription' do
          subject.update(plan)

          expect(stripe_subscription).to_not have_received(:save)
        end

        it 'does not create new subscription' do
          subject.update(plan)

          expect(Stripe::Subscription).to_not have_received(:create)
        end
      end

      context 'when new plan is different than current' do
        it 'sets new plan for subscription' do
          subject.update(new_plan)

          expect(stripe_subscription.plan).to eq(new_plan.id)
        end

        it 'sets prorate for subscription to false' do
          subject.update(new_plan)

          expect(stripe_subscription.prorate).to be(false)
        end

        it 'saves subscription' do
          subject.update(new_plan)

          expect(stripe_subscription).to have_received(:save)
        end

        context 'with card source provided' do
          it 'updates card before updating subscription' do
            allow(stripe_customer).to receive(:save) do
              expect(stripe_subscription).to_not have_received(:save)
            end

            subject.update(new_plan, new_card_source)
          end
        end
      end

      context 'when customer has no existing subscription' do
        let(:stripe_customer) do
          Stripe::Customer.construct_from(stripe_json_fixture('customer.json'))
        end

        before do
          allow(Stripe::Subscription).to receive(:create).and_return(stripe_subscription)
        end

        it 'creates a new subscription' do
          subject.update(new_plan)

          expect(Stripe::Subscription).to have_received(:create)
        end

        it 'sets customer for created subscription' do
          subject.update(new_plan)

          expect(Stripe::Subscription).to have_received(:create).with(hash_including(customer: stripe_customer.id))
        end

        it 'sets id for plan' do
          subject.update(new_plan)

          expect(Stripe::Subscription).to have_received(:create).with(hash_including(plan: new_plan.id))
        end

        context 'when 3D Secure source is provided' do
          it 'adds 1 month trial period for created subscription' do
            # We're expecting the trial end to be set relative to now so pause time to be able to match against it
            allow(Time).to receive(:now).and_return(Time.now)

            subject.update(plan, new_card_source, three_d_secure_source)

            expect(Stripe::Subscription).to have_received(:create)
              .with hash_including(trial_end: 1.month.from_now.to_i)
          end
        end

        context 'when encoutering card errors' do
          let(:card_error) do
            Stripe::CardError.new('Your card was declined.', nil, 'card_declined')
          end

          before do
            allow(Stripe::Subscription).to receive(:create).and_raise(card_error)
          end

          it 'adds error to errors hash' do
            subject.update(plan)

            expect(subject.errors).to include(card_declined: 'Your card was declined.')
          end

          it 'returns false' do
            expect(subject.update(plan)).to be(false)
          end
        end
      end

      context 'with card source provided' do
        it 'creates new source for customer' do
          subject.update(plan, new_card_source)

          expect(stripe_customer.sources).to have_received(:create).with(hash_including(source: new_card_source))
        end

        it 'sets new source as new customer default' do
          subject.update(plan, new_card_source)

          expect(stripe_customer.default_source).to eq(new_card_source.id)
        end

        it 'saves updated customer' do
          subject.update(plan, new_card_source)

          expect(stripe_customer).to have_received(:save)
        end

        context 'when encoutering card errors' do
          let(:card_error) do
            Stripe::CardError.new('Your card was declined.', nil, 'card_declined')
          end

          before do
            allow(stripe_customer).to receive(:save).and_raise(card_error)
          end

          it 'adds error to errors hash' do
            subject.update(plan, new_card_source)

            expect(subject.errors).to include(card_declined: 'Your card was declined.')
          end

          it 'returns false' do
            expect(subject.update(plan, new_card_source)).to be(false)
          end
        end

        context 'when 3D Secure source is provided' do
          it 'creates an initial charge to complete verification' do
            subject.update(plan, new_card_source, three_d_secure_source)

            expect(Stripe::Charge).to have_received(:create)
          end

          it 'uses plan monthly cost as amount for initial charge' do
            subject.update(plan, new_card_source, three_d_secure_source)

            expect(Stripe::Charge).to have_received(:create).with hash_including(amount: plan.amount)
          end

          it 'uses plan currency as currency for initial charge' do
            subject.update(plan, new_card_source, three_d_secure_source)

            expect(Stripe::Charge).to have_received(:create).with hash_including(currency: plan.currency)
          end

          it 'uses provided 3D Secure source for initial charge' do
            subject.update(plan, new_card_source, three_d_secure_source)

            expect(Stripe::Charge).to have_received(:create).with hash_including(source: three_d_secure_source)
          end

          it 'uses created customer for initial charge' do
            subject.update(plan, new_card_source, three_d_secure_source)

            expect(Stripe::Charge).to have_received(:create).with hash_including(customer: subject.customer.id)
          end

          it 'adds 1 month trial period to skip next monthly payment' do
            # We're expecting the trial end to be set relative to now so pause time to be able to match against it
            allow(Time).to receive(:now).and_return(Time.now)

            subject.update(plan, new_card_source, three_d_secure_source)

            expect(stripe_subscription.trial_end).to eq(1.month.from_now.to_i)
            expect(stripe_subscription).to have_received(:save)
          end

          context 'when 3D Secure source is not chargeable after verification' do
            before do
              allow(Stripe::Source).to receive(:retrieve).and_return(
                Stripe::Source.construct_from(stripe_json_fixture('source_three_d_secure_failed.json'))
              )
            end

            it 'adds error to errors hash' do
              subject.update(plan, new_card_source, three_d_secure_source)

              expect(subject.errors).to include(verification_failed: 'Card verification was not successful.')
            end

            it 'does not update default card for customer' do
              expect do
                subject.update(plan, new_card_source, three_d_secure_source)
              end.to_not(change { stripe_customer.default_source })
            end

            it 'returns false' do
              expect(subject.update(plan, new_card_source, three_d_secure_source)).to be(false)
            end
          end
        end
      end
    end
  end
end
