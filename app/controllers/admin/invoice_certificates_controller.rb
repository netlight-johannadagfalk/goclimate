# frozen_string_literal: true

module Admin
  class InvoiceCertificatesController < AdminController
    def show
      pdf = certificate_pdf

      send_data(
        pdf.render,
        filename: "GoClimateNeutral Certificate - #{pdf.receiver}.pdf",
        type: :pdf
      )
    end

    def send_email
      @pdf = certificate_pdf
      @invoice = certificate_invoice

      InvoiceCertificateMailer.with(
        email: @invoice.certificate_reciever_email,
        reciever: @pdf.receiver,
        certificate_pdf: @pdf.render
      ).invoice_certificate_email.deliver_now

      @invoice.update(certificate_sent_at: Time.now)
    end

    def certificate_invoice
      case params[:type]
      when 'invoice'
        Invoice.find(params[:id])
      when 'climate_report_invoice'
        ClimateReportInvoice.find(params[:id])
      end
    end

    def certificate_pdf
      case params[:type]
      when 'invoice'
        InvoiceCertificatePdf.from_invoice(Invoice.find(params[:id]))
      when 'climate_report_invoice'
        InvoiceCertificatePdf.from_climate_report_invoice(ClimateReportInvoice.find(params[:id]))
      end
    end
  end
end
