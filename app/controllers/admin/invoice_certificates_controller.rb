# frozen_string_literal: true

module Admin
  class InvoiceCertificatesController < AdminController
    before_action :set_invoice_and_pdf

    def show
      send_data(
        @pdf.render,
        filename: "GoClimateNeutral Certificate - #{@pdf.receiver}.pdf",
        type: :pdf
      )
    end

    def send_email
      InvoiceCertificateMailer.with(
        email: @invoice.certificate_reciever_email,
        reciever: @pdf.receiver,
        certificate_pdf: @pdf.render
      ).invoice_certificate_email.deliver_now

      @invoice.update(certificate_sent_at: Time.now)
    end

    def set_invoice_and_pdf
      case params[:type]
      when 'invoice'
        @invoice = Invoice.find(params[:id])
        @pdf = InvoiceCertificatePdf.from_invoice(@invoice)
      when 'climate_report_invoice'
        @invoice = ClimateReportInvoice.find(params[:id])
        @pdf = InvoiceCertificatePdf.from_climate_report_invoice(@invoice)
      end
    end
  end
end
