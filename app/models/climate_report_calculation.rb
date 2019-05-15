# frozen_string_literal: true

class ClimateReportCalculation < ApplicationRecord
  belongs_to :climate_report

  validates_presence_of :climate_report, :electricity_consumption_emissions,
                        :heating_emissions, :servers_emissions, :flight_emissions, :car_emissions,
                        :meals_emissions, :purchased_computers_emissions,
                        :purchased_phones_emissions, :purchased_monitors_emissions,
                        :other_emissions

  before_validation :perform_calcuation, on: :create

  def self.create_from_climate_report(climate_report)
    create(climate_report: climate_report)
  end

  def total_emissions
    electricity_consumption_emissions + heating_emissions + servers_emissions +
      flight_emissions + car_emissions + meals_emissions +
      purchased_computers_emissions + purchased_phones_emissions +
      purchased_monitors_emissions + other_emissions
  end

  private

  def perform_calcuation
    calculate_electricity_consumption_emissions
    calculate_heating_emissions
    calculate_servers_emissions
    calculate_flight_emissions
    calculate_car_emissions
    calculate_meals_emissions
    calculate_purchased_computers_emissions
    calculate_purchased_phones_emissions
    calculate_purchased_monitors_emissions
    set_other_emissions
  end

  def calculate_electricity_consumption_emissions
    if climate_report.electricity_consumption.nil?
      self.electricity_consumption_emissions = 0
      return
    end

    self.electricity_consumption_emissions = (BigDecimal('0.329') * climate_report.electricity_consumption).ceil
  end

  def calculate_heating_emissions
    if climate_report.heating.nil?
      self.heating_emissions = 0
      return
    end

    self.heating_emissions = (BigDecimal('0.071') * climate_report.heating).ceil
  end

  def calculate_servers_emissions
    if climate_report.number_of_servers.nil?
      self.servers_emissions = 0
      return
    end

    self.servers_emissions = 500 * climate_report.number_of_servers
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

    self.car_emissions = (BigDecimal('0.123') * climate_report.car_distance).ceil
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
    self.other_emissions = climate_report.other_co2e
  end
end
