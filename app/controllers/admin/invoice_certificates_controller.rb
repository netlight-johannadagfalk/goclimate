# frozen_string_literal: true

module Admin
  class InvoiceCertificatesController < AdminController
    def show
      generator =
        case params[:type]
        when 'invoice'
          InvoiceCertificatePDFGenerator.from_invoice(Invoice.find(params[:id]))
        when 'climate_report_invoice'
          InvoiceCertificatePDFGenerator.from_climate_report_invoice(ClimateReportInvoice.find(params[:id]))
        end

      pdf = generator.generate_pdf

      send_data(
        pdf,
        filename: "GoClimateNeutral Certificate - #{generator.receiver}.pdf",
        pe: :pdf
      )
    end
  end
end
