# frozen_string_literal: true

# This class is enumerating all calculations and is as a result pretty long. In
# the future, this could be split into classes for each emission area or
# similar, but for now calculations are simple enough to be understandable even
# though the class is looong. Take care to not add other responsibility to this
# class as that would make its length a problem.
class ClimateReportCalculation < ApplicationRecord # rubocop:disable Metrics/ClassLength
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

  def total_emissions # rubocop:disable Metrics/AbcSize
    electricity_consumption_emissions + heating_emissions + servers_emissions +
      cloud_servers_emissions + flight_emissions + car_emissions +
      meals_emissions + purchased_computers_emissions +
      purchased_phones_emissions + purchased_monitors_emissions +
      other_emissions
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

  def office_area_for_calculation
    climate_report.office_area || climate_report.employees * 15
  end

  def electricity_consumption_for_calculation
    if climate_report.use_electricity_averages
      office_area_for_calculation * 122
    else
      climate_report.electricity_consumption
    end
  end

  def heating_consumption_for_calculation
    if climate_report.use_heating_averages
      office_area_for_calculation * 117
    else
      climate_report.heating
    end
  end

  # MARK: Calculations

  def calculate_electricity_consumption_emissions
    electricity_consumption = electricity_consumption_for_calculation

    if electricity_consumption.nil? || climate_report.green_electricity
      self.electricity_consumption_emissions = 0
      return
    end

    self.electricity_consumption_emissions = (BigDecimal('0.329') * electricity_consumption).ceil
  end

  def calculate_heating_emissions
    heating_consumption = heating_consumption_for_calculation

    if heating_consumption.nil?
      self.heating_emissions = 0
      return
    end

    self.heating_emissions = (BigDecimal('0.06592') * heating_consumption).ceil
  end

  def calculate_servers_emissions
    if climate_report.number_of_servers.nil?
      self.servers_emissions = 0
      return
    end

    yearly_emissions_per_server =
      if climate_report.servers_green_electricity
        320
      else
        899
      end

    self.servers_emissions = yearly_emissions_per_server * climate_report.number_of_servers
  end

  def calculate_cloud_servers_emissions
    if climate_report.number_of_cloud_servers.nil?
      self.cloud_servers_emissions = 0
      return
    end

    yearly_emissions_per_server =
      if climate_report.cloud_servers_green_electricity
        160
      else
        450
      end

    self.cloud_servers_emissions = yearly_emissions_per_server * climate_report.number_of_cloud_servers
  end

  def calculate_flight_emissions
    if climate_report.flight_hours.nil?
      self.flight_emissions = 0
      return
    end

    self.flight_emissions = 200 * climate_report.flight_hours
  end

  def calculate_car_emissions
    if climate_report.car_distance.nil?
      self.car_emissions = 0
      return
    end

    self.car_emissions = (BigDecimal('0.122') * climate_report.car_distance).ceil
  end

  def calculate_meals_emissions
    if climate_report.meals.nil?
      self.meals_emissions = 0
      return
    end

    vegetarian_factor = BigDecimal(climate_report.meals_vegetarian_share) / 100
    vegetarian_meals = vegetarian_factor * climate_report.meals
    omnivore_meals = climate_report.meals - vegetarian_meals

    self.meals_emissions = (BigDecimal('2.1') * omnivore_meals + BigDecimal('0.7') * vegetarian_meals).ceil
  end

  def calculate_purchased_computers_emissions
    if climate_report.purchased_computers.nil?
      self.purchased_computers_emissions = 0
      return
    end

    self.purchased_computers_emissions = 350 * climate_report.purchased_computers
  end

  def calculate_purchased_phones_emissions
    if climate_report.purchased_phones.nil?
      self.purchased_phones_emissions = 0
      return
    end

    self.purchased_phones_emissions = 70 * climate_report.purchased_phones
  end

  def calculate_purchased_monitors_emissions
    if climate_report.purchased_monitors.nil?
      self.purchased_monitors_emissions = 0
      return
    end

    self.purchased_monitors_emissions = 500 * climate_report.purchased_monitors
  end

  def set_other_emissions
    self.other_emissions = climate_report.other_co2e || 0
  end
end
