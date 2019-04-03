# frozen_string_literal: true

class FlightSegment
  include ActiveModel::Model

  attr_reader :flight, :origin, :destination, :duration

  validates_presence_of :flight, :origin, :destination

  def initialize(attributes = {})
    @flight = attributes[:flight]
    @origin = attributes[:origin]
    @destination = attributes[:destination]
    @duration = attributes[:duration].to_i
  end

  def ==(other)
    flight == other.flight &&
      origin == other.origin &&
      destination == other.destination
  end
end
