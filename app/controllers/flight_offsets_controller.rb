# frozen_string_literal: true

class FlightOffsetsController < ApplicationController
  def new
    @offset_params = FlightOffsetParameters.from_s(params[:offset_params])
    @footprint = FlightFootprint.new({cabin_class: @offset_params.cabin_class, segments: @offset_params.segments})
    @price = (@footprint.footprint.to_f / 1000 * LifestyleChoice::SEK_PER_TONNE).to_i * 100
    @projects = Project.order(id: :desc).limit(2)
  end

  def create
    redirect_to action: :thank_you
  end

  def thank_you
  end
end
