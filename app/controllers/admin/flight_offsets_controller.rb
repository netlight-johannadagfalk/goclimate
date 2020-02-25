# frozen_string_literal: true

module Admin
  class FlightOffsetsController < AdminController
    def index
      @flight_offsets = FlightOffset.order(created_at: :desc).limit(100)
    end

    def show
      @flight_offset = FlightOffset.find(params[:id])
    end

    def new
      @flight_offset = FlightOffset.new
    end

    def create
      @flight_offset = FlightOffset.new(
        params.require(:flight_offset).permit(:co2e, :email)
      )

      @flight_offset.price = Money.new(0, :sek)
      @flight_offset.paid_at = Time.now

      unless @flight_offset.save
        render :new
        return
      end

      redirect_to admin_flight_offset_path(@flight_offset.id)
    end
  end
end
