# frozen_string_literal: true

module FootprintCalculation
  class FlightSegment
    include ActiveModel::Model

    attr_reader :origin, :destination

    validates_presence_of :origin, :destination

    def initialize(attributes = {})
      @origin = attributes[:origin]
      @destination = attributes[:destination]
    end

    def ==(other)
      origin == other.origin &&
        destination == other.destination
    end
  end
end
