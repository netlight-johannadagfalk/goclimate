# frozen_string_literal: true

require 'rails_helper'

RSpec.describe User do
  subject(:user) { build(:user, stripe_customer_id: 'cus_TEST') }

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

  describe '.with_active_subscription' do
    context 'with user with active subscription' do
      before do
        create(:user)
      end

      it 'includes it' do
        expect(described_class.with_active_subscription.count).to eq(1)
      end
    end

    context 'with user with subscription that will end but has not yet' do
      before do
        create(:user_with_subscription_ending_in_future)
      end

      it 'includes it' do
        expect(described_class.with_active_subscription.count).to eq(1)
      end
    end

    context 'with users without active subscription' do
      before do
        create(:user_with_ended_subscription)
      end

      it 'does not include it' do
        expect(described_class.with_active_subscription.count).to eq(0)
      end
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
end
