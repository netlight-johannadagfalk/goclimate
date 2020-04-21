# frozen_string_literal: true

class ClimateReportPdf
  attr_reader :receiver, :co2e, :issued_at, :comment, :project

  CALCULATION_FIELDS = [
    {name: 'energy', category: true},
    {name: 'electricity_consumption'},
    {name: 'heating'},
    {name: 'servers'},
    {name: 'cloud_servers'},
    {name: 'business_trips', category: true},
    {name: 'flight'},
    {name: 'car'},
    {name: 'meals', category: true},
    {name: 'material', category: true},
    {name: 'purchased_computers'},
    {name: 'purchased_phones'},
    {name: 'purchased_monitors'},
    {name: 'other', category: true}
  ]

  def initialize(climate_report)
    @company_name = climate_report.company_name
    @co2e = climate_report.calculation.total_emissions
    @employees = climate_report.employees
    @calculation_period = climate_report.calculation_period
    @climate_report = climate_report
  end

  def render
    WickedPdf.new.pdf_from_string(
      ApplicationController.render(
        template: 'pdfs/climate_report',
        layout: false,
        assigns: {
          company_name: @company_name,
          co2e: @co2e,
          employees: @employees,
          co2e_per_employee: @co2e / @employees,
          calculation_period: @calculation_period,
          climate_report: @climate_report,
          calculation_fields: CALCULATION_FIELDS,
          pie_data: pie_data.map { |d| d.values.join('') },
          pie_labels: pie_data.map { |d| d.keys.join('') }
        }
      ),
      orientation: 'portrait'
    )
  end

  def pie_data
    fields = CALCULATION_FIELDS.map do |field|
      field if field.has_key? :category
    end.compact

    data = []

    fields.each do |field|
      emission = @climate_report.calculation.send("#{field[:name]}_emissions")
      data << {I18n.t("business.climate_reports.#{field[:name]}") => (BigDecimal(emission) / @co2e * 100).round}
    end

    data
  end
end
