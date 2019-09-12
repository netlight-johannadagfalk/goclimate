# frozen_string_literal: true

class FlightOffsetReceiptsController < ApplicationController
  def show
    @receipt = FlightOffsetReceiptPdf.new(FlightOffset.find_by_key!(params[:key]))
    send_data @receipt.render, filename: 'receipt.pdf', type: :pdf
  end
end
