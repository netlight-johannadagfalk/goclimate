# frozen_string_literal: true

class ClimateReportPdf

  CALCULATION_FIELDS = [
    {name: 'energy', scope: [2, 3]},
    {name: 'electricity_consumption', category: 'energy', scope: [2]},
    {name: 'heating', category: 'energy', scope: [2]},
    {name: 'servers', category: 'energy', scope: [3]},
    {name: 'cloud_servers', category: 'energy', scope: [3]},
    {name: 'business_trips', scope: [3]},
    {name: 'flight', category: 'business_trips', scope: [3]},
    {name: 'car', category: 'business_trips', scope: [3]},
    {name: 'meals', scope: [3]},
    {name: 'material', scope: [3]},
    {name: 'purchased_computers', category: 'material', scope: [3]},
    {name: 'purchased_phones', category: 'material', scope: [3]},
    {name: 'purchased_monitors', category: 'material', scope: [3]},
    {name: 'other', scope: [3]}
  ]

  def initialize(climate_report)
    @cr = climate_report
  end

  def render
    @cover = ActionController::Base.new().render_to_string(
      template: 'pdfs/cover.html.erb',
      assigns: { 
        climate_report: @cr,
        calculation_period: @cr.calculation_period,
        company_name: @cr.company_name
      }
    )

    WickedPdf.new.pdf_from_string(
      ApplicationController.render(
        template: 'pdfs/climate_report',
        layout: false,
        assigns: {
          company_name: @cr.company_name,
          co2e: @cr.calculation.total_emissions,
          employees: @cr.employees,
          co2e_per_employee: @cr.calculation.total_emissions / @cr.employees,
          calculation_period: @cr.calculation_period,
          climate_report: @cr,
          calculation_fields: CALCULATION_FIELDS,
          pie_chart: pie_chart_data,
          pie_scope_data: pie_scope_data.values,
          pie_scope_labels: pie_scope_data.keys,
          field_percentages: field_percentages,
          bar_category_data: bar_category_data.map { |d| d.values.join('') },
          bar_category_labels: bar_category_data.map { |d| d.keys.join('') },
          bar_data: bar_data.map { |d| d.values.join('') },
          bar_labels: bar_data.map { |d| d.keys.join('') },
          compare_category_bar_data: compare_bar_data(category_fields).map { |d| d.values.join('') },
          compare_category_bar_labels: compare_bar_data(category_fields).map { |d| d.keys.join('') },
          compare_bar_data: compare_bar_data(emission_sources_fields).map { |d| d.values.join('') },
          compare_bar_labels: compare_bar_data(emission_sources_fields).map { |d| d.keys.join('') }
        }
      ),
      footer: {
        right: "Sida [page] av [topage]",
        left: @cr.company_name,
        font_name: 'sans-serif',
        font_size: 10
      },
      cover: @cover,
      orientation: 'portrait'
    )
  end

  def category_fields
    fields = CALCULATION_FIELDS.map do |field|
      field unless field.has_key? :category
    end.compact
    add_field_emissions fields
  end

  def emission_sources_fields
    fields = CALCULATION_FIELDS.map do |field|
      field if field.has_key? :category
    end.compact
    add_field_emissions fields
  end

  def add_field_emissions(fields)
    fields.each do |field|
      field[:emissions] = @cr.calculation.send("#{field[:name]}_emissions")
    end
  end

  def field_percentage(field)
    BigDecimal(@cr.calculation.send("#{field[:name]}_emissions")) / @cr.calculation.total_emissions * 100
  end

  def field_percentages
    total_emissions = @cr.calculation.total_emissions

    category_data = {}
    category_fields.map do |field|
      category_data[field[:name]] = field_percentage field
    end
    category_percentages = get_even_percentages category_data
    
    category_and_sources_percentages = category_percentages.clone
    category_data.map do |k, v|
      sources_data = {}
      fields_in_category = emission_sources_fields.map { |source| source if (source.has_key?(:category) && source[:category] == k ) }.compact
      sources_data = {}
      fields_in_category.map do |field|
        sources_data[field[:name]] = field_percentage field
      end
      category_and_sources_percentages.merge!(get_even_percentages(sources_data, v))
    end

    category_and_sources_percentages
  end

  def pie_chart_data
    percentages = {}
    category_fields.map do |field|
      percentages[field_name(field)] = field_percentage field
    end
    data = get_even_percentages(percentages)
    { labels: data.keys.join("', '"), data: data.values.join(', ') }
  end

  def pie_scope_data
    scopes = { 'Scope 2' => 0, 'Scope 3' => 0 }
    emission_sources_fields.map do |field|
      scopes["Scope #{field[:scope][0]}"] += field[:emissions]
    end

    scopes.each do |k, v|
      scopes[k] = BigDecimal(v) / @cr.calculation.total_emissions * 100
    end

    get_even_percentages(scopes)
  end

  def bar_data
    emission_sources_fields.map do |field|
      { field_name(field) => field[:emissions].round } unless field[:emissions] == 0
    end.compact
  end

  def bar_category_data
    category_fields.map do |field|
      { field_name(field) => field[:emissions].round } unless field[:emissions] == 0
    end.compact
  end

  def compare_bar_data(bar_fields)
    data = []
    climate_reports = ClimateReportInvoice.includes(climate_report: :calculation)
    total_employees = climate_reports.inject(0) { |n, cri| n + cri.climate_report.employees }

    bar_fields.each do |field|
      next if field[:emissions] == 0

      total_emissions = climate_reports.inject(0) do |n, cri|
        n + cri.climate_report.calculation.send("#{field[:name]}_emissions")
      end      
      average_emission_per_employee = total_emissions / total_employees
      data << { field_name(field) => field[:emissions].round / @cr.employees }
      data << { field_average_name(field) => average_emission_per_employee.round }
    end
    data
  end

  def field_name(field)
    I18n.t("business.climate_reports.#{field[:name]}")
  end

  def field_average_name(field)
    "#{I18n.t("business.climate_reports.#{field[:name]}")} - #{I18n.t('business.climate_reports.average')}"
  end

  # more on algorithm: https://revs.runtime-revolution.com/getting-100-with-rounded-percentages-273ffa70252b
  # { "a": 0.5, "b": 0.51, "c": 98.9 } ->
  # { "a": 0, "b": 1, "c": 99 } not { "a": 1, "b": 1, "c": 99 }
  def get_even_percentages(dataset, max = 100)
    diff = max - dataset.inject(0) { |sum, d| sum + d[1].floor }
    dataset
      .sort_by { |x| x[1].floor - x[1] }
      .map
      .with_index { |e, index| index < diff ? dataset[e[0]] = e[1].floor + 1 : dataset[e[0]] = e[1].floor }
    dataset
  end
end
