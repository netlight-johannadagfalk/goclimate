# frozen_string_literal: true

class OffsetCertificatePDFGenerator
  attr_reader :amount_co2

  def initialize(attributes)
    @amount_co2 = attributes[:amount_co2]
  end

  def generate_pdf
    WickedPdf.new.pdf_from_string(
      ApplicationController.render(
        template: 'pdfs/offset_certificate',
        layout: false,
        assigns: {
          amount_co2: @amount_co2
        }
      ),
      orientation: 'portrait'
    )
  end
end
