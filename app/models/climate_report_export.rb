# frozen_string_literal: true

require 'csv'

class ClimateReportExport
  HEADERS = [
    'Company',
    'Period',
    'Date',
    'Total footprint',
    'Footprint per employee',
    'Energy',
    '- Electricity',
    '- Heating',
    '- Servers',
    '- Cloud servers',
    'Business trips',
    '- Flights',
    '- Car & taxi',
    'Food',
    'Materials',
    '- Purchased computers',
    '- Purchased phones & tablets',
    '- Purchased monitors',
    'Other',
    'Energy %',
    '- Electricity %',
    '- Heating %',
    '- Servers %',
    '- Cloud servers %',
    'Business trips %',
    '- Flights %',
    '- Car & taxi %',
    'Food %',
    'Materials %',
    '- Purchased computers %',
    '- Purchased phones & tablets %',
    '- Purchased monitors %',
    'Other %'
  ].freeze
  CALCULATION_COLUMN_FIELDS = %w[
    energy electricity_consumption heating servers cloud_servers business_trips
    flight car meals material purchased_computers purchased_phones
    purchased_monitors other
  ].freeze

  attr_reader :climate_reports

  def initialize(climate_reports)
    @climate_reports = climate_reports
  end

  def to_csv
    CSV.generate do |csv|
      csv << HEADERS

      @climate_reports.each do |climate_report|
        csv << [
          climate_report.company_name,
          climate_report.calculation_period,
          climate_report.invoice.created_at.in_time_zone('Europe/Stockholm').to_date,
          co2e_string(climate_report.calculation.total_emissions),
          co2e_string(climate_report.calculation.per_employee_emissions)
        ] + calculation_columns(climate_report)
      end
    end
  end

  def calculation_columns(climate_report)
    CALCULATION_COLUMN_FIELDS.map do |field|
      co2e_string(climate_report.calculation.send("#{field}_emissions"))
    end + CALCULATION_COLUMN_FIELDS.map do |field|
      share_string(
        climate_report.calculation.send("#{field}_emissions"),
        climate_report.calculation.total_emissions
      )
    end
  end

  def co2e_string(co2e)
    return '' if co2e == 0

    co2e_tonnes = BigDecimal(co2e) / 1000
    co2e_tonnes.truncate(co2e_tonnes < 0.1 ? 2 : 1).to_s('F')
  end

  def share_string(co2e, total_co2e)
    return '' if co2e == 0

    percent = (BigDecimal(co2e) / total_co2e * 100).round
    "#{percent} %"
  end
end
