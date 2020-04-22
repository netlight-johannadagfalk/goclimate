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
          pie_labels: pie_data.map { |d| d.keys.join('') },
          bar_data: bar_data.map { |d| d.values.join('') },
          bar_labels: bar_data.map { |d| d.keys.join('') },
          compare_category_bar_data: compare_category_bar_data.map { |d| d.values.join('') },
          compare_category_bar_labels: compare_category_bar_data.map { |d| d.keys.join('') },
          compare_bar_data: compare_bar_data.map { |d| d.values.join('') },
          compare_bar_labels: compare_bar_data.map { |d| d.keys.join('') }
        }
      ),
      footer: {
        content: "<div style='font-family: sans-serif; font-size:14px;'><span>#{@company_name}</span><span style='float:right'>Utf&oumlrd: #{@climate_report.created_at.to_date}</span></div>"
      },
      orientation: 'portrait'
    )
  end

  def category_fields
    fields = CALCULATION_FIELDS.map do |field|
      field if field.has_key? :category
    end.compact
  end

  def emission_sources_fields
    fields = CALCULATION_FIELDS.map do |field|
      field unless field.has_key? :category
    end.compact
  end

  def pie_data
    category_fields.map do |field|
      emission = @climate_report.calculation.send("#{field[:name]}_emissions")
      {I18n.t("business.climate_reports.#{field[:name]}") => (BigDecimal(emission) / @co2e * 100).round}
    end.compact
  end

  def bar_data
    emission_sources_fields.map do |field|
      emission = @climate_report.calculation.send("#{field[:name]}_emissions")
      { I18n.t("business.climate_reports.#{field[:name]}") => emission.round } unless emission == 0
    end.compact
  end

  def compare_bar_data
    data = []
    emission_sources_fields.each do |field|
      total_emissions = ClimateReportInvoice.all.inject(1) { |n, cri | n + cri.climate_report.calculation.send("#{field[:name]}_emissions") }
      total_employees = ClimateReportInvoice.all.inject(1) { |n, cri | n + cri.climate_report.employees }
      average_emission_per_employee = total_emissions / total_employees
      emission = @climate_report.calculation.send("#{field[:name]}_emissions")
      data << { I18n.t("business.climate_reports.#{field[:name]}") => emission.round / @employees } unless emission == 0
      data << { I18n.t("business.climate_reports.#{field[:name]}") + ' - ' + I18n.t("business.climate_reports.average") => average_emission_per_employee.round } unless emission == 0
    end
    data
  end

  def compare_category_bar_data
    data = []
    category_fields.each do |field|
      total_emissions = ClimateReportInvoice.all.inject(1) { |n, cri | n + cri.climate_report.calculation.send("#{field[:name]}_emissions") }
      total_employees = ClimateReportInvoice.all.inject(1) { |n, cri | n + cri.climate_report.employees }
      average_emission_per_employee = total_emissions / total_employees
      emission = @climate_report.calculation.send("#{field[:name]}_emissions")
      data << { I18n.t("business.climate_reports.#{field[:name]}") => emission.round / @employees } unless emission == 0
      data << { I18n.t("business.climate_reports.#{field[:name]}") + ' - ' + I18n.t("business.climate_reports.average") => average_emission_per_employee.round } unless emission == 0
    end
    data
  end
end
