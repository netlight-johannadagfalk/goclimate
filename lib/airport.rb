# frozen_string_literal: true

require 'csv'

class Airport
  class NotFoundError < StandardError; end

  attr_reader :iata_code, :name, :latitude, :longitude

  @airports = {}

  def self.import!
    @airports = CSV.read('config/airports.dat')
                   .map { |line| from_csv(line) }
                   .to_h { |airport| [airport.iata_code, airport] }
  end

  def self.find(iata_code)
    @airports[iata_code] || raise(NotFoundError)
  end

  def self.from_csv(line)
    new(line[4], line[1], line[6].to_f, line[7].to_f)
  end
  private_class_method :from_csv

  def initialize(iata_code, name, latitude, longitude)
    @iata_code = iata_code
    @name = name
    @latitude = latitude
    @longitude = longitude
  end

  def distance_to(other)
    Haversine.distance(
      latitude, longitude,
      other.latitude, other.longitude
    ).to_kilometers.round
  end
end

Airport.import!
