# frozen_string_literal: true

module FootprintCalculation
  class FlightFootprint
    include ActiveModel::Model

    attr_reader :cabin_class, :segments

    validates :cabin_class, inclusion: { in: %w[economy premium_economy business first] }
    validates_each :segments do |record, attr, value|
      record.errors.add(attr, 'must all be valid') unless value.is_a?(Array) && value.all?(&:valid?)
    end

    def initialize(attributes = {})
      @cabin_class = attributes[:cabin_class]
      @segments = attributes[:segments]
      @num_persons = (attributes[:num_persons].presence || 1).to_i
    end

    def footprint
      @footprint ||= GreenhouseGases.new(total_footprint)
    end

    private

    def total_footprint
      segments = @segments.map do |segment|
        GenericFlightFootprint.new(segment_distance(segment), @cabin_class.to_sym).footprint
      end.sum.ceil(-2)

      segments * @num_persons
    end

    def segment_distance(segment)
      Airport.find(segment.origin).distance_to(Airport.find(segment.destination))
    end
  end
end
