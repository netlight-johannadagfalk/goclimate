# frozen_string_literal: true

class InvoiceCertificatePDFGenerator
  def initialize(invoice)
    @invoice = invoice
  end

  def generate_pdf
    I18n.with_locale(:sv) do
      WickedPdf.new.pdf_from_string(
        ApplicationController.render(
          template: 'pdfs/invoice_certificate',
          layout: false,
          assigns: {
            invoice: @invoice
          }
        ),
        orientation: 'portrait'
      )
    end
  end
end
