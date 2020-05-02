# frozen_string_literal: true

class ClimateReportPdf
  CALCULATION_FIELDS = [
    { name: 'energy', scope: [2, 3] },
    { name: 'electricity_consumption', category: 'energy', scope: [2] },
    { name: 'heating', category: 'energy', scope: [2] },
    { name: 'servers', category: 'energy', scope: [3] },
    { name: 'cloud_servers', category: 'energy', scope: [3] },
    { name: 'business_trips', scope: [3] },
    { name: 'flight', category: 'business_trips', scope: [3] },
    { name: 'car', category: 'business_trips', scope: [3] },
    { name: 'meals', scope: [3] },
    { name: 'meals', category: 'meals', scope: [3] },
    { name: 'material', scope: [3] },
    { name: 'purchased_computers', category: 'material', scope: [3] },
    { name: 'purchased_phones', category: 'material', scope: [3] },
    { name: 'purchased_monitors', category: 'material', scope: [3] },
    { name: 'other', scope: [3] },
    { name: 'other', category: 'other', scope: [3] }
  ].freeze

  def initialize(climate_report)
    @cr = climate_report
  end

  def render
    @cover = ActionController::Base.new.render_to_string(
      template: 'pdfs/cover.html.erb',
      assigns: {
        climate_report: @cr
      }
    )
    WickedPdf.new.pdf_from_string(
      ApplicationController.render(
        template: 'pdfs/climate_report',
        layout: false,
        assigns: {
          climate_report: @cr,
          calculation_period_length: calculation_period_length,
          calculation_fields: all_fields,
          climate_periods_to_compare: climate_periods_to_compare,
          pie_categories_data: pie_data(categories),
          pie_sources_data: pie_data(emissions),
          pie_scope_data: pie_scope_data,
          bar_categories_data: bar_emissions_data(categories),
          bar_emissions_data: bar_emissions_data(emissions),
          bar_compare_categories_data: bar_compare_data(categories),
          bar_compare_emissions_data: bar_compare_data(emissions),
          bar_compare_years_categories_data: bar_compare_years_data(categories),
          bar_compare_years_emissions_data: bar_compare_years_data(emissions),
          bar_compare_years_categories_per_employee_data: bar_compare_years_data(categories, true),
          bar_compare_years_emissions_per_employee_data: bar_compare_years_data(emissions, true)
        }
      ),
      footer: {
        right: 'Sida [page] av [topage]',
        left: @cr.company_name,
        font_name: 'sans-serif',
        font_size: 10
      },
      cover: @cover,
      orientation: 'portrait'
    )
  end

  def categories
    all_fields.map { |field| field unless field.key?(:category) }.compact
  end

  def emissions
    all_fields.map { |field| field if field.key?(:category) }.compact
  end

  def all_fields
    fields = CALCULATION_FIELDS
    fields = fields.each { |f| f[:emissions] = @cr.calculation.send("#{f[:name]}_emissions") }
    add_field_percentages(fields)
  end

  def add_field_percentages(fields)
    category_data = {}
    fields.map { |f| category_data[f[:name]] = field_percentage(f) unless f.key?(:category) }
    category_data = get_even_percentages(category_data)
    category_and_sources_percentages = category_data.clone
    category_data.map do |k, v|
      fields_in_category = fields.map { |f| f if f.key?(:category) && f[:category] == k }.compact
      sources_data = {}
      fields_in_category.map { |field| sources_data[field[:name]] = field_percentage(field) }
      category_and_sources_percentages.merge!(get_even_percentages(sources_data, v))
    end
    fields.map { |f| f[:percentage] = category_and_sources_percentages[f[:name]] }
    fields
  end

  def field_percentage(field)
    BigDecimal(@cr.calculation.send("#{field[:name]}_emissions")) / @cr.calculation.total_emissions * 100
  end

  def pie_data(fields)
    data = {}
    fields.map do |field|
      data[field_name(field)] = field[:percentage] unless field[:percentage] == 0
    end
    { labels: "'#{data.keys.join("', '")}'", data: data.values.join(', ') }
  end

  def pie_scope_data
    scopes = { 'Scope 2' => 0, 'Scope 3' => 0 }
    emissions.map do |field|
      scopes["Scope #{field[:scope][0]}"] += field[:emissions]
    end
    scopes.each do |k, v|
      scopes[k] = BigDecimal(v) / @cr.calculation.total_emissions * 100
    end
    data = get_even_percentages(scopes)
    data.filter! { |_, v| v != 0 }
    { labels: "'#{data.keys.join("', '")}'", data: data.values.join(', ') }
  end

  def bar_emissions_data(fields)
    data = fields.map do |field|
      { field_name(field) => field[:emissions].round } unless field[:emissions] == 0
    end.compact
    {
      data: data.map { |d| d.values.join('') },
      labels: data.map { |d| d.keys.join('') }
    }
  end

  def bar_compare_data(bar_fields)
    data = []
    climate_reports = ClimateReportInvoice.includes(climate_report: :calculation)
    total_employees = climate_reports.inject(0) { |n, cri| n + cri.climate_report.employees }

    bar_fields.each do |field|
      next if field[:emissions] == 0

      total_emissions = climate_reports.inject(0) do |n, cri|
        n + cri.climate_report.calculation.send("#{field[:name]}_emissions")
      end
      data << { field_name(field) => field[:emissions].round / @cr.employees }
      data << { field_average_name(field) => (total_emissions / total_employees).round }
    end
    {
      data: data.map { |d| d.values.join('') },
      labels: data.map { |d| d.keys.join('') }
    }
  end

  def climate_periods_to_compare
    ClimateReport.joins(:invoice).where(company_name: @cr.company_name).count
  end

  def bar_compare_years_data(bar_fields, per_employee = false)
    data = []
    climate_reports = ClimateReport.joins(:invoice).where(company_name: @cr.company_name)

    return nil if climate_reports.count < 2

    bar_fields.each do |field|
      climate_reports.each do |climate_report|
        emission = climate_report.calculation.send("#{field[:name]}_emissions")
        emission = BigDecimal(emission) / climate_report.employees if per_employee
        data << { "#{climate_report.calculation_period} - #{field_name(field)}" => emission.round }
      end
    end
    {
      data: data.map { |d| d.values.join('') },
      labels: data.map { |d| d.keys.join('') }
    }
  end

  def field_name(field)
    I18n.t("business.climate_reports.#{field[:name]}")
  end

  def field_average_name(field)
    "#{I18n.t("business.climate_reports.#{field[:name]}")} - #{I18n.t('business.climate_reports.average')}"
  end

  def calculation_period_length
    length = @cr.calculation_period_length
    return nil if length.nil? || length == 'year'

    "(#{I18n.t("business.climate_reports.calculation_period_length_options.#{length}").downcase})"
  end

  # more on algorithm: https://revs.runtime-revolution.com/getting-100-with-rounded-percentages-273ffa70252b
  # { "a": 0.5, "b": 0.51, "c": 98.9 } ->
  # { "a": 0, "b": 1, "c": 99 } not { "a": 1, "b": 1, "c": 99 }
  def get_even_percentages(dataset, max = 100)
    diff = max - dataset.inject(0) { |sum, d| sum + d[1].floor }
    dataset
      .sort_by { |x| x[1].floor - x[1] }
      .map
      .with_index { |e, index| dataset[e[0]] = index < diff ? e[1].floor + 1 : e[1].floor }
    dataset
  end
end
