# frozen_string_literal: true

require 'rails_helper'

RSpec.describe NewsletterSubscriber do
  describe '.new' do
    context 'with a valid email address' do
      subject { build(:newsletter_subscriber, email: 'test@example.com') }

      it { is_expected.to be_valid }
    end

    context 'with an invalid email address' do
      subject { build(:newsletter_subscriber, email: 'test.example.com') }

      it { is_expected.to be_invalid }
    end
  end
end
