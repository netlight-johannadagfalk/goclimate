# frozen_string_literal: true

class ClimateReportInvoice < ApplicationRecord
  ADMIN_FEE_IN_SEK = 1000

  belongs_to :climate_report

  validates_presence_of :invoice_address, :co2e, :amount, :currency

  def calculate_from_report
    self.co2e = climate_report.calculation.total_emissions
    self.amount = calculate_amount
    self.currency = 'sek'
  end

  private

  # Calculate amount in SEK lowest denominator
  def calculate_amount
    (BigDecimal(co2e) / 1000 * LifestyleChoice::BUSINESS_SEK_PER_TONNE + ADMIN_FEE_IN_SEK).ceil * 100
  end
end
