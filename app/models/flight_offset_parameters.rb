# frozen_string_literal: true

class FlightOffsetParameters
  attr_reader :cabin_class, :segments

  def self.from_s(serilized_parameters)
    cabin_class, *airports = serilized_parameters.split(',')
    segments = airports.each_slice(2).map do |s|
      FootprintCalculation::FlightSegment.new(origin: s[0], destination: s[1])
    end

    new(cabin_class, segments)
  end

  def initialize(cabin_class, segments)
    @cabin_class = cabin_class
    @segments = segments
  end

  def to_s
    "#{cabin_class},#{segments.map { |s| "#{s.origin},#{s.destination}" }.join(',')}"
  end
end
