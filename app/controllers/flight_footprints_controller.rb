# frozen_string_literal: true

class FlightFootprintsController < ApplicationController
  def new
  end

  def create
    render json: {
      footprint: footprint.footprint.to_s(precision: :auto),
      price: footprint.footprint.consumer_price(current_region.currency).to_s,
      offset_path: new_flight_offset_path(offset_params: offset_params)
    }
  rescue FootprintCalculation::Airport::NotFoundError
    head :bad_request
  end

  private

  def footprint
    @footprint ||= FootprintCalculation::FlightFootprint.new(footprint_params)
  end

  def offset_params
    FlightOffsetParameters.new(
      params[:cabin_class],
      footprint.segments
    ).to_s
  end

  def footprint_params
    params.permit(:cabin_class).merge(segments: segments)
  end

  def segments
    segments = segments_from_airports(
      params[:origin_airport],
      [*params[:outbound_connection_airports], params[:destination_airport]]
    )

    if params[:return_trip] == '1'
      segments += segments_from_airports(
        params[:destination_airport],
        [*params[:return_connection_airports], params[:origin_airport]]
      )
    end

    segments
  end

  def segments_from_airports(origin, destinations)
    destinations = destinations.reject(&:blank?)

    destinations.reduce([]) do |segments, destination|
      segments << FootprintCalculation::FlightSegment.new(
        origin: segments.last&.destination || origin,
        destination: destination
      )
    end
  end
end
