# frozen_string_literal: true

class FlightOffsetCertificatesController < ApplicationController
  def show
    @offset = FlightOffset.find_by_key(params[:key])
    pdf = FlightOffsetCertificatePdf.new(@offset).render

    send_data pdf, filename: 'GoClimateNeutral Offset Certificate.pdf', type: :pdf
  end
end
