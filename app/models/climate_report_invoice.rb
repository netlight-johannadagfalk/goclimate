# frozen_string_literal: true

class ClimateReportInvoice < ApplicationRecord
  belongs_to :climate_report
  belongs_to :project, optional: true

  validates_presence_of :invoice_address, :co2e, :amount, :currency
  validates :certificate_reciever_email, email: true

  BUFFER_FACTOR = 2

  def calculate_from_report
    self.co2e = climate_report.calculation.total_emissions * BUFFER_FACTOR
    self.amount = calculate_amount
    self.currency = 'sek'
  end

  private

  # Calculate amount in SEK lowest denominator
  def calculate_amount
    admin_fee = case climate_report.employees
                when 1..10
                  1000
                when 11..20
                  2000
                else
                  5000
                end

    (BigDecimal(co2e) / 1000 * GreenhouseGases::BUSINESS_PRICE_PER_TONNE_SEK.amount.to_i + admin_fee).ceil * 100
  end
end
