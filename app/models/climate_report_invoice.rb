# frozen_string_literal: true

class ClimateReportInvoice < ApplicationRecord
  include HasMoneyAttributes

  belongs_to :climate_report
  belongs_to :project, optional: true

  attribute :currency, :currency
  money_attribute :amount, :currency

  validates_presence_of :invoice_address, :co2e, :amount, :currency
  validates :certificate_reciever_email, email: true

  BUFFER_FACTOR = 2

  def calculate_from_report
    self.co2e = climate_report.calculation.total_emissions * BUFFER_FACTOR
    self.amount = calculate_amount
    self.currency = Currency::SEK
  end

  private

  # Calculate amount in SEK lowest denominator
  def calculate_amount
    admin_fee =
      case climate_report.employees
      when 1..10
        1_000_00
      when 11..20
        2_000_00
      else
        5_000_00
      end

    GreenhouseGases.new(co2e).business_price(Currency::SEK).subunit_amount + admin_fee
  end
end
