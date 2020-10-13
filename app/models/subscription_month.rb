# frozen_string_literal: true

class SubscriptionMonth < ApplicationRecord
  belongs_to :user
  belongs_to :payment, polymorphic: true

  attribute :co2e, :greenhouse_gases
  attribute :currency, :currency

  validates_presence_of :start_at, :co2e
  validates :payment_type, inclusion: { in: %w[CardCharge] } # This can soon be ReferralCode too
end
