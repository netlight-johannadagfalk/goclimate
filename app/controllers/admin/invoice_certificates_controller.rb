# frozen_string_literal: true

module Admin
  class InvoiceCertificatesController < AdminController
    def show
      @invoice = Invoice.find(params[:id])
      pdf = InvoiceCertificatePDFGenerator.new(@invoice).generate_pdf

      send_data pdf, filename: 'GoClimateNeutral Certificate.pdf', type: :pdf
    end
  end
end
