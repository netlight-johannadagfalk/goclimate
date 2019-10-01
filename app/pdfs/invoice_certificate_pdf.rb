# frozen_string_literal: true

class InvoiceCertificatePdf
  attr_reader :receiver, :co2e, :issued_at, :comment, :project

  def self.from_invoice(invoice)
    new(invoice.receiver, invoice.co2e, invoice.created_at, invoice.comment, invoice.project)
  end

  def self.from_climate_report_invoice(invoice)
    new(
      invoice.climate_report.company_name, invoice.co2e, invoice.created_at,
      invoice.climate_report.calculation_period, invoice.project
    )
  end

  def initialize(receiver, co2e, issued_at, comment, project)
    @receiver = receiver
    @co2e = co2e
    @issued_at = issued_at
    @comment = comment
    @project = project
  end

  def render
    WickedPdf.new.pdf_from_string(
      ApplicationController.render(
        template: 'pdfs/invoice_certificate',
        layout: false,
        assigns: {
          receiver: receiver,
          co2e: co2e,
          issued_at: issued_at,
          comment: comment,
          project: project
        }
      ),
      orientation: 'portrait'
    )
  end
end
