# frozen_string_literal: true

require 'securerandom'

class FlightOffset < ApplicationRecord
  attribute :currency, :currency
  attribute :co2e, :greenhouse_gases

  validates :key, uniqueness: true, format: { with: /\A[a-f0-9]{40}\z/ }
  validates :email, email: true
  validates_presence_of :co2e, :price, :currency, :email, :payment_intent_id

  before_validation :generate_key

  def send_confirmation_email
    FlightOffsetMailer.with(
      flight_offset: self,
      certificate_pdf: FlightOffsetCertificatePdf.new(self).render
    ).flight_offset_email.deliver_now
  end

  def to_param
    key
  end

  def order_id
    "GCN-FLIGHT-#{id}"
  end

  def price
    value = super
    Money.new(value, currency) if value.present?
  end

  def price=(price)
    if price.is_a?(Money)
      self.currency = price.currency
      super(price.subunit_amount)
      return
    end

    super(price)
  end

  private

  def generate_key
    self.key = SecureRandom.hex(20) unless key.present?
  end
end
