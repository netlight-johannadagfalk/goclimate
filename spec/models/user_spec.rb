# frozen_string_literal: true

require 'rails_helper'

RSpec.describe User do
  subject(:user) { build(:user) }

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
      allow(user).to receive(:save)

      user.update_from_stripe_subscription(current_subscription)

      expect(user).not_to have_received(:save)
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
