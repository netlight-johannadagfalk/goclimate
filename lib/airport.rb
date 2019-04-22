# frozen_string_literal: true

require 'csv'

class Airport
  class NotFoundError < StandardError; end

  attr_reader :iata_code, :name, :latitude, :longitude

  @airports = {}

  def self.import!
    # Update this file with `rake update_airports_csv`
    @airports = CSV.read('config/airports.csv', headers: true)
                   .map { |line| from_csv(line) }
                   .compact
                   .to_h { |airport| [airport.iata_code, airport] }
  end

  def self.find(iata_code)
    @airports[iata_code] || raise(NotFoundError)
  end

  def self.from_csv(line)
    new(line['iata_code'], line['name'], line['name_sv'], line['latitude'].to_f, line['longitude'].to_f)
  end
  private_class_method :from_csv

  def initialize(iata_code, name, name_sv, latitude, longitude)
    @iata_code = iata_code
    @name = name
    @name_sv = name_sv
    @latitude = latitude
    @longitude = longitude
  end

  def distance_to(other)
    Haversine.distance(
      latitude, longitude,
      other.latitude, other.longitude
    ).to_kilometers.round
  end

  def name_sv
    @name_sv.presence || name
  end
end

Airport.import!
