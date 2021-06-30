# frozen_string_literal: true

module Subscriptions
  class ReferralCode < ApplicationRecord
    has_many :referred_users, class_name: 'User', foreign_key: 'referred_from_id'
    has_many :subscription_months, as: :payment

    validates :code, allow_nil: true, format: {
      with: /\A[a-zA-Z0-9\-]+\Z/, message: 'can only contain letters, digits and dashes'
    }
    validates :destination_path, allow_nil: true, format: {
      with: %r{\A/(?!/).*\Z}, message: 'must be a link without protocol & domain parts'
    }

    def self.model_name
      @model_name ||= ActiveModel::Name.new(self, nil, 'referral_code')
    end

    def referred_users_count
      referred_users.count
    end

    def subscription_months_total_co2e
      GreenhouseGases.new(subscription_months.sum(:co2e))
    end
  end
end
