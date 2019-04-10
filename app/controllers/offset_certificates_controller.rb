# frozen_string_literal: true

class OffsetCertificatesController < ApplicationController
  def show
    pdf = OffsetCertificatePDFGenerator.new(amount_co2: 3).generate_pdf

    send_data pdf, filename: 'GoClimateNeutral Offset Certificare.pdf', type: :html
  end
end
