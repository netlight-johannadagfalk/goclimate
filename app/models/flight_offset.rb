# frozen_string_literal: true

require 'securerandom'

class FlightOffset < ApplicationRecord
  validates_presence_of :co2e, :charged_amount, :charged_currency, :email, :stripe_charge_id
  validates :key, uniqueness: true, format: { with: /\A[a-f0-9]{40}\z/ }

  before_validation :generate_key

  def to_param
    key
  end

  def order_id
    "GCN-FLIGHT-#{id}"
  end

  def charged_money
    Money.new(charged_amount, Currency.from_iso_code(charged_currency))
  end

  def charged_money=(money)
    self.charged_amount = money.subunit_amount
    self.charged_currency = money.currency.iso_code.to_s
  end

  private

  def generate_key
    self.key = SecureRandom.hex(20) unless key.present?
  end
end
