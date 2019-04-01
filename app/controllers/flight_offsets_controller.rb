# frozen_string_literal: true

class FlightOffsetsController < ApplicationController
  def new
    @offset_params = FlightOffsetParameters.from_s(params[:offset_params])
  end

  def create
    redirect_to action: :thank_you
  end

  def thank_you
  end
end
