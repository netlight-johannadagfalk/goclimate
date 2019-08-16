# frozen_string_literal: true

module Admin
  class InvoiceCertificatesController < AdminController
    def show
      @invoice = Invoice.find(params[:id])
      pdf = InvoiceCertificatePDFGenerator.new(@invoice).generate_pdf

      send_data pdf,
                filename: "GoClimateNeutral Certificate - #{@invoice.receiver} - #{@invoice.fortnox_id}.pdf",
                pe: :pdf
    end
  end
end
