# frozen_string_literal: true

module Admin
  class InvoiceCertificatesController < AdminController
    def show
      pdf =
        case params[:type]
        when 'invoice'
          InvoiceCertificatePdf.from_invoice(Invoice.find(params[:id]))
        when 'climate_report_invoice'
          InvoiceCertificatePdf.from_climate_report_invoice(ClimateReportInvoice.find(params[:id]))
        end

      send_data(
        pdf.render,
        filename: "GoClimateNeutral Certificate - #{pdf.receiver}.pdf",
        pe: :pdf
      )
    end
  end
end
