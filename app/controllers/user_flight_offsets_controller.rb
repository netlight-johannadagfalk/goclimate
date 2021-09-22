# frozen_string_literal: true

class UserFlightOffsetsController < ApplicationController
  before_action :authenticate_user!

  def index
    @user_flight_offsets = FlightOffset.where(user_id: current_user.id).order(created_at: :desc)
  end
end
