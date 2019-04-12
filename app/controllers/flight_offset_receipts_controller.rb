# frozen_string_literal: true

class FlightOffsetReceiptsController < ApplicationController
  def show
    @receipt = FlightOffsetReceipt.new(FlightOffset.find_by_key!(params[:key]))
    send_data @receipt.generate_pdf, filename: 'receipt.pdf', type: :pdf
  end
end
