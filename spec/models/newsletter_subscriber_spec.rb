# frozen_string_literal: true

require 'rails_helper'

RSpec.describe NewsletterSubscriber do
  describe '.new' do
    context 'with a valid email address' do
      subject { build(:newsletter_subscriber) }

      it { is_expected.to be_valid }
    end

    context 'with an invalid email address' do
      subject { build(:newsletter_subscriber, email: 'test@examplecom') }

      it { is_expected.to be_invalid }
    end

    context 'with a valid user id' do
      subject { build(:newsletter_subscriber, user_id: user.id) }

      let(:user) { create(:user) }

      it { is_expected.to be_valid }
    end

    context 'with an invalid user id' do
      subject { build(:newsletter_subscriber, user_id: 90_909_090) }

      it { is_expected.to be_invalid }
    end

    context 'with an invalid newsletter type' do
      subject { build(:newsletter_subscriber, newsletter_type: 'invalid_type') }

      it { is_expected.to be_invalid }
    end

    context 'with an existing email but different newsletter type' do
      subject(:newsletter_subscriber) { build(:newsletter_subscriber, newsletter_type: 'business') }

      before do
        create(:newsletter_subscriber, newsletter_type: 'consumer')
      end

      it { is_expected.to be_valid }
    end

    context 'with a combination of email and newsletter type that already exists' do
      subject(:newsletter_subscriber) { build(:newsletter_subscriber, newsletter_type: 'consumer') }

      before do
        create(:newsletter_subscriber, newsletter_type: 'consumer')
      end

      it { is_expected.to be_invalid }
    end
  end
end
