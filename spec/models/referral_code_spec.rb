# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ReferralCode do
  subject(:code) { described_class.new }

  describe '#code' do
    it 'validates when containing only letters, digits and dashes' do
      code = described_class.new(code: 'Aa-1')
      code.validate

      expect(code.errors[:code]).to be_empty
    end

    it 'allows nil' do
      code = described_class.new(code: nil)
      code.validate

      expect(code.errors[:code]).to be_empty
    end

    it 'does not allow other characters' do
      code = described_class.new(code: 'Aa 1')
      code.validate

      expect(code.errors[:code]).not_to be_empty
    end

    it 'does not allow empty values' do
      code = described_class.new(code: '')
      code.validate

      expect(code.errors[:code]).not_to be_empty
    end
  end

  describe '#destination_path' do
    it 'validates when containing a valid path' do
      code = described_class.new(destination_path: '/some/path?with=query_params&another=one')
      code.validate

      expect(code.errors[:destination_path]).to be_empty
    end

    it 'allows nil' do
      code = described_class.new(destination_path: nil)
      code.validate

      expect(code.errors[:destination_path]).to be_empty
    end

    it 'allows /' do
      code = described_class.new(destination_path: '/')
      code.validate

      expect(code.errors[:destination_path]).to be_empty
    end

    it 'validates to start with a /' do
      code = described_class.new(destination_path: 'http://not.allowed/')
      code.validate

      expect(code.errors[:destination_path]).not_to be_empty
    end

    it 'validates to not start with //' do
      code = described_class.new(destination_path: '//not.allowed/')
      code.validate

      expect(code.errors[:destination_path]).not_to be_empty
    end
  end

  describe '#referred_user_count' do
    before do
      create_list(:user, 2, referred_from: code)
    end

    it 'counts number of referred users' do
      expect(code.referred_users_count).to eq(2)
    end
  end

  describe '#subscription_months_total_co2e' do
    before do
      create_list(:subscription_month, 2, co2e: 1200, payment: code)
    end

    it 'counts number of referred users' do
      expect(code.subscription_months_total_co2e).to eq(GreenhouseGases.new(2400))
    end
  end
end
