# frozen_string_literal: true

require 'rails_helper'

RSpec.describe User do
  describe '.with_active_subscription' do
    context 'with user without any subscription' do
      before do
        create(:user)
      end

      it 'includes nothing' do
        expect(User.with_active_subscription.count).to eq(0)
      end
    end

    context 'with user with active subscription' do
      before do
        create(:user_with_active_subscription)
      end

      it 'includes it' do
        expect(User.with_active_subscription.count).to eq(1)
      end
    end
  end
end
