# frozen_string_literal: true

require 'rails_helper'

RSpec.describe User do
  subject(:user) { build(:user, stripe_customer_id: stripe_customer&.id) }

  let(:stripe_customer) do
    Stripe::Customer.construct_from(stripe_json_fixture('customer.json'))
  end

  describe '#search_email' do
    before do
      create(:user, email: 'test@email.com')
      create(:user, email: 'test2@email.com')
    end

    it 'returns no relations if none are found' do
      expect(described_class.search_email('notexistingemail').count).to eq(0)
    end

    it 'returns one relations with perfect match' do
      expect(described_class.search_email('test@email.com').first.email).to eq('test@email.com')
    end

    it 'returns multiple relations with part match' do
      expect(described_class.search_email('email.com').count).to be > 1
    end
  end

  describe '#stripe_customer' do
    before do
      allow(Stripe::Customer)
        .to receive(:retrieve)
        .with(id: user.stripe_customer_id, expand: %w[subscriptions sources])
        .and_return(stripe_customer)
    end

    it 'returns associated stripe customer' do
      expect(user.stripe_customer).to eq(stripe_customer)
    end

    context 'when no Stripe customer is associated' do
      subject(:user) { build(:user, stripe_customer_id: nil) }

      before do
        allow(Stripe::Customer).to receive(:create).and_return(stripe_customer)
      end

      it 'creates a Stripe customer' do
        user.stripe_customer

        expect(Stripe::Customer).to have_received(:create)
      end

      it 'sets email for new Stripe customer' do
        user.stripe_customer

        expect(Stripe::Customer).to have_received(:create).with hash_including(
          email: user.email
        )
      end

      it 'updates stripe_customer_id to new Stripe customer' do
        user.stripe_customer

        expect(user.stripe_customer_id).to eq(stripe_customer.id)
      end
    end
  end

  describe '#user_name' do
    context 'with a user_name with an @ sign' do
      subject { build(:user, user_name: 'Jod@') }

      it { is_expected.to be_valid }
    end

    context 'with a user_name that is an email' do
      subject { build(:user, user_name: 'jod@test.com') }

      it { is_expected.to be_invalid }
    end
  end

  describe '#number_of_neutral_months' do
    before do
      allow(Stripe::Customer)
        .to receive(:retrieve)
        .with(id: user.stripe_customer_id, expand: %w[subscriptions sources])
        .and_return(stripe_customer)
    end

    context 'with no subscription months' do
      # TODO: This is based on the now false assumption that every user is a
      # subscriber. Needs to be conditioned on having an active subscription.
      it 'returns 1' do
        expect(user.number_of_neutral_months).to eq(1)
      end
    end

    context 'with subscription months' do
      before do
        create_list(:subscription_month, 3, user: user)
      end

      it 'returns the count of paid months' do
        expect(user.number_of_neutral_months).to eq(3)
      end
    end
  end

  describe '#total_subscription_offsetting' do
    before do
      create(:subscription_month, co2e: 800, user: user)
      create(:subscription_month, co2e: 1200, user: user)
    end

    it 'returns the sum of all subscription months co2e' do
      expect(user.total_subscription_offsetting).to eq(GreenhouseGases.new(2000))
    end
  end

  describe '#update_from_stripe_subscription' do
    let(:current_subscription) do
      Stripe::Subscription.construct_from(stripe_json_fixture('subscription.json'))
    end
    let(:cancelled_subscription) do
      Stripe::Subscription.construct_from(stripe_json_fixture('subscription_cancelled.json'))
    end

    # We need to test change handling, so keep it saved before we go
    before { user.save }

    it 'sets subscription_end_at to subscription end date' do
      user.update_from_stripe_subscription(cancelled_subscription)

      expect(user.subscription_end_at).to eq(Time.at(cancelled_subscription.ended_at))
    end

    it 'saves updates' do
      user.update_from_stripe_subscription(cancelled_subscription)

      expect(user.changed?).not_to be(true)
    end

    it 'does not save to database when nothing changed' do
      expect do
        user.update_from_stripe_subscription(current_subscription)
      end.not_to change(user, :updated_at)
    end

    context 'when user has cancelled subscription before' do
      subject(:user) { build(:user_with_ended_subscription) }

      it 'clears subscription_end_at when Stripe subscription is current' do
        user.update_from_stripe_subscription(current_subscription)

        expect(user.subscription_end_at).to be(nil)
      end
    end
  end

  describe '#three_months_since_last_card_charge?' do
    it 'evaluates to false when no card_charges are present' do
      expect(user.three_months_since_last_card_charge?).to eq(false)
    end

    it 'evaluates to true when last card charge is more than three months ago' do
      create(:card_charge_four_months_ago, stripe_customer_id: user.stripe_customer_id)

      expect(user.three_months_since_last_card_charge?).to eq(true)
    end

    it 'evaluates to false when last card charge is less than three months ago' do
      create(:card_charge_one_month_ago, stripe_customer_id: user.stripe_customer_id)

      expect(user.three_months_since_last_card_charge?).to eq(false)
    end
  end
end
