# frozen_string_literal: true

module Admin
  class BusinessCertificatesController < AdminController
    def show
      @invoice = Invoice.find(params[:id])
      pdf = BusinessCertificatePDFGenerator.new(@invoice).generate_pdf

      send_data pdf, filename: 'GoClimateNeutral Business Certificate.pdf', type: :pdf
    end
  end
end
