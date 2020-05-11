# frozen_string_literal: true

# This class is enumerating all calculations and is as a result pretty long. In
# the future, this could be split into classes for each emission area or
# similar, but for now calculations are simple enough to be understandable even
# though the class is looong. Take care to not add other responsibility to this
# class as that would make its length a problem.
class ClimateReportCalculation < ApplicationRecord # rubocop:disable Metrics/ClassLength
  AVERAGE_OFFICE_AREA_PER_EMPLOYEE                 = 15 # sqm/employee
  AVERAGE_ELECTRICITY_CONSUMPTION_PER_SQM_OFFICES  = 122 # kwH/sqm/year
  AVERAGE_HEATING_CONSUMPTION_PER_SQM_OFFICES      = 117 # kwH/sqm/year
  GREEN_ELECTRICITY_EMISSIONS                      = BigDecimal('0.006') # kg CO2e/kwH for scope 3 emissions
  NORDIC_RESIDUAL_MIX_EMISSIONS                    = BigDecimal('0.329') # kg CO2e/kwH
  AVERAGE_HEATING_EMISSIONS_SWEDEN                 = BigDecimal('0.06592') # kg CO2e/kwH
  TYPICAL_SERVER_EMISSIONS                         = 899 # kg CO2e/year
  TYPICAL_SERVER_EMISSIONS_GREEN_ELECTRICITY       = 320 # kg CO2e/year
  TYPICAL_CLOUD_SERVER_EMISSIONS                   = 450 # kg CO2e/year
  TYPICAL_CLOUD_SERVER_EMISSIONS_GREEN_ELECTRICITY = 160 # kg CO2e/year
  TYPICAL_FLIGHT_EMISSIONS_PER_HOUR                = 200 # kg CO2e/flight hour
  TYPICAL_CAR_EMISSIONS_PER_KILOMETER              = BigDecimal('0.122') # kg CO2e/km
  TYPICAL_OMNIVORE_MEAL_EMISSIONS                  = BigDecimal('2.1') # kg CO2e/meal
  TYPICAL_VEGETARIAN_MEAL_EMISSIONS                = BigDecimal('0.7') # kg CO2e/meal
  TYPICAL_PURCHASED_COMPUTER_EMISSIONS             = 350 # kg CO2e/purchased computer
  TYPICAL_PURCHASED_PHONE_EMISSIONS                = 70 # kg CO2e/purchased phone
  TYPICAL_PURCHASED_MONITOR_EMISSIONS              = 500 # kg CO2e/purchased monitor

  SCOPE_CATEGORIES = {
    energy: [2, 3],
    business_trips: [3],
    meals: [3],
    material: [3],
    other: [3]
  }.freeze

  SCOPE_EMISSIONS = {
    electricity_consumption: 2,
    heating: 2,
    servers: 3,
    cloud_servers: 3,
    flight: 3,
    car: 3,
    meals: 3,
    purchased_computers: 3,
    purchased_phones: 3,
    purchased_monitors: 3,
    other: 3
  }.freeze

  CALCULATION_FIELDS = [
    { name: 'energy' }.freeze,
    { name: 'electricity_consumption', category: 'energy' }.freeze,
    { name: 'heating', category: 'energy' }.freeze,
    { name: 'servers', category: 'energy' }.freeze,
    { name: 'cloud_servers', category: 'energy' }.freeze,
    { name: 'business_trips' }.freeze,
    { name: 'flight', category: 'business_trips' }.freeze,
    { name: 'car', category: 'business_trips' }.freeze,
    { name: 'meals' }.freeze,
    { name: 'meals', category: 'meals' }.freeze,
    { name: 'material' }.freeze,
    { name: 'purchased_computers', category: 'material' }.freeze,
    { name: 'purchased_phones', category: 'material' }.freeze,
    { name: 'purchased_monitors', category: 'material' }.freeze,
    { name: 'other' }.freeze,
    { name: 'other', category: 'other' }.freeze
  ].freeze

  belongs_to :climate_report

  validates_presence_of :climate_report, :electricity_consumption_emissions,
                        :heating_emissions, :servers_emissions, :cloud_servers_emissions,
                        :flight_emissions, :car_emissions, :meals_emissions,
                        :purchased_computers_emissions, :purchased_phones_emissions,
                        :purchased_monitors_emissions, :other_emissions

  before_validation :perform_calcuation, on: :create

  def self.create_from_climate_report!(climate_report)
    create!(climate_report: climate_report)
  end

  def total_emissions
    energy_emissions + business_trips_emissions + meals_emissions +
      material_emissions + other_emissions
  end

  def per_employee_emissions
    (BigDecimal(total_emissions) / climate_report.employees).ceil
  end

  def energy_emissions
    electricity_consumption_emissions + heating_emissions + servers_emissions + cloud_servers_emissions
  end

  def business_trips_emissions
    flight_emissions + car_emissions
  end

  def material_emissions
    purchased_computers_emissions + purchased_phones_emissions + purchased_monitors_emissions
  end

  def scope_2_emissions
    SCOPE_EMISSIONS.inject(0) do |sum, (emission_name, scope)|
      scope == 2 ? sum + send("#{emission_name}_emissions") : sum
    end
  end

  def scope_3_emissions
    SCOPE_EMISSIONS.inject(0) do |sum, (emission_name, scope)|
      scope == 3 ? sum + send("#{emission_name}_emissions") : sum
    end
  end

  def scope_3_percentage
    BigDecimal(scope_3_emissions) / total_emissions * 100
  end

  def scope_2_percentage
    BigDecimal(scope_2_emissions) / total_emissions * 100
  end

  def even_scopes_percentages
    get_even_percentages('Scope 2': scope_2_percentage, 'Scope 3': scope_3_percentage)
  end

  def scope(name, category)
    category ? SCOPE_CATEGORIES[name.to_sym] : [SCOPE_EMISSIONS[name.to_sym]]
  end

  def categories
    all_fields_with_data.filter { |field| !field.key?(:category) }
  end

  def emissions
    all_fields_with_data.filter { |field| field.key?(:category) }
  end

  def all_fields_with_data
    CALCULATION_FIELDS.map do |f|
      f.dup.merge(
        emissions: send("#{f[:name]}_emissions"),
        scope: scope(f[:name], f[:category].nil?),
        percentage: f[:category].nil? ? category_percentages[f[:name]] : emission_percentages[f[:name]]
      )
    end
  end

  def category_percentages
    category_data = {}
    CALCULATION_FIELDS.each { |f| category_data[f[:name]] = field_percentage(f) unless f.key?(:category) }
    get_even_percentages(category_data)
  end

  def emission_percentages
    category_percentages.map do |k, v|
      fields_in_category = CALCULATION_FIELDS.filter { |f| f.key?(:category) && f[:category] == k }
      sources_data = {}
      fields_in_category.each { |field| sources_data[field[:name]] = field_percentage(field) }
      get_even_percentages(sources_data, v)
    end.inject(:merge)
  end

  def field_percentage(field)
    BigDecimal(send("#{field[:name]}_emissions")) / total_emissions * 100
  end

  # more on algorithm: https://revs.runtime-revolution.com/getting-100-with-rounded-percentages-273ffa70252b
  # { "a": 0.5, "b": 0.51, "c": 98.9 } ->
  # { "a": 0, "b": 1, "c": 99 } not { "a": 1, "b": 1, "c": 99 }
  def get_even_percentages(dataset, max = 100)
    diff = max - dataset.map { |_, v| v.floor }.sum
    dataset
      .sort_by { |_, v| v.floor - v }
      .map
      .with_index { |(k, v), i| [k, i < diff ? v.floor + 1 : v.floor] }.to_h
  end

  private

  def perform_calcuation
    calculate_electricity_consumption_emissions
    calculate_heating_emissions
    calculate_servers_emissions
    calculate_cloud_servers_emissions
    calculate_flight_emissions
    calculate_car_emissions
    calculate_meals_emissions
    calculate_purchased_computers_emissions
    calculate_purchased_phones_emissions
    calculate_purchased_monitors_emissions
    set_other_emissions
  end

  # MARK: Derived values used for calculation

  def period_length_multiplier
    case climate_report.calculation_period_length
    when 'half-year'
      BigDecimal('0.5')
    when 'quarter'
      BigDecimal('0.25')
    else
      1
    end
  end

  def office_area_for_calculation
    climate_report.office_area || climate_report.employees * AVERAGE_OFFICE_AREA_PER_EMPLOYEE
  end

  def electricity_consumption_for_calculation
    if climate_report.use_electricity_averages
      (office_area_for_calculation * AVERAGE_ELECTRICITY_CONSUMPTION_PER_SQM_OFFICES * period_length_multiplier).ceil
    else
      climate_report.electricity_consumption
    end
  end

  def heating_consumption_for_calculation
    if climate_report.use_heating_averages
      (office_area_for_calculation * AVERAGE_HEATING_CONSUMPTION_PER_SQM_OFFICES * period_length_multiplier).ceil
    else
      climate_report.heating
    end
  end

  # MARK: Calculations

  def calculate_electricity_consumption_emissions
    electricity_consumption = electricity_consumption_for_calculation

    if electricity_consumption.nil?
      self.electricity_consumption_emissions = 0
      return
    end

    electricity_emissions =
      if climate_report.green_electricity
        GREEN_ELECTRICITY_EMISSIONS
      else
        NORDIC_RESIDUAL_MIX_EMISSIONS
      end

    self.electricity_consumption_emissions = (electricity_emissions * electricity_consumption).ceil
  end

  def calculate_heating_emissions
    heating_consumption = heating_consumption_for_calculation

    if heating_consumption.nil?
      self.heating_emissions = 0
      return
    end

    self.heating_emissions = (AVERAGE_HEATING_EMISSIONS_SWEDEN * heating_consumption).ceil
  end

  def calculate_servers_emissions
    if climate_report.number_of_servers.nil?
      self.servers_emissions = 0
      return
    end

    yearly_emissions_per_server =
      if climate_report.servers_green_electricity
        TYPICAL_SERVER_EMISSIONS_GREEN_ELECTRICITY
      else
        TYPICAL_SERVER_EMISSIONS
      end

    self.servers_emissions =
      (yearly_emissions_per_server * climate_report.number_of_servers * period_length_multiplier).ceil
  end

  def calculate_cloud_servers_emissions
    if climate_report.number_of_cloud_servers.nil?
      self.cloud_servers_emissions = 0
      return
    end

    yearly_emissions_per_server =
      if climate_report.cloud_servers_green_electricity
        TYPICAL_CLOUD_SERVER_EMISSIONS_GREEN_ELECTRICITY
      else
        TYPICAL_CLOUD_SERVER_EMISSIONS
      end

    self.cloud_servers_emissions =
      (yearly_emissions_per_server * climate_report.number_of_cloud_servers * period_length_multiplier).ceil
  end

  def calculate_flight_emissions
    if climate_report.flight_hours.nil?
      self.flight_emissions = 0
      return
    end

    self.flight_emissions = TYPICAL_FLIGHT_EMISSIONS_PER_HOUR * climate_report.flight_hours
  end

  def calculate_car_emissions
    if climate_report.car_distance.nil?
      self.car_emissions = 0
      return
    end

    self.car_emissions = (TYPICAL_CAR_EMISSIONS_PER_KILOMETER * climate_report.car_distance).ceil
  end

  def calculate_meals_emissions
    if climate_report.meals.nil?
      self.meals_emissions = 0
      return
    end

    vegetarian_factor = BigDecimal(climate_report.meals_vegetarian_share || 0) / 100
    vegetarian_meals = vegetarian_factor * climate_report.meals
    omnivore_meals = climate_report.meals - vegetarian_meals

    self.meals_emissions = (
      TYPICAL_OMNIVORE_MEAL_EMISSIONS * omnivore_meals +
      TYPICAL_VEGETARIAN_MEAL_EMISSIONS * vegetarian_meals
    ).ceil
  end

  def calculate_purchased_computers_emissions
    if climate_report.purchased_computers.nil?
      self.purchased_computers_emissions = 0
      return
    end

    self.purchased_computers_emissions = TYPICAL_PURCHASED_COMPUTER_EMISSIONS * climate_report.purchased_computers
  end

  def calculate_purchased_phones_emissions
    if climate_report.purchased_phones.nil?
      self.purchased_phones_emissions = 0
      return
    end

    self.purchased_phones_emissions = TYPICAL_PURCHASED_PHONE_EMISSIONS * climate_report.purchased_phones
  end

  def calculate_purchased_monitors_emissions
    if climate_report.purchased_monitors.nil?
      self.purchased_monitors_emissions = 0
      return
    end

    self.purchased_monitors_emissions = TYPICAL_PURCHASED_MONITOR_EMISSIONS * climate_report.purchased_monitors
  end

  def set_other_emissions
    self.other_emissions = climate_report.other_co2e || 0
  end
end
