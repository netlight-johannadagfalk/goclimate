# frozen_string_literal: true

class ClimateReport < ApplicationRecord
  has_one :calculation, class_name: 'ClimateReportCalculation'
  has_one :invoice, class_name: 'ClimateReportInvoice'

  validates_presence_of :company_name, :contact_email, :employees, :country,
                        :calculation_period, :calculation_period_length
  validates :calculation_period_length, inclusion: %w[year half-year quarter]
  validates :contact_email, email: true
  validates :country, country: true
  validates :key, uniqueness: true, format: { with: /\A[a-f0-9]{40}\z/ }
  validates :meals_vegetarian_share, inclusion: 1..100, allow_nil: true

  before_validation :generate_key

  def to_param
    key
  end

  private

  def generate_key
    self.key = SecureRandom.hex(20) unless key.present?
  end
end
