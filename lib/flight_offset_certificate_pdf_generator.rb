# frozen_string_literal: true

class FlightOffsetCertificatePDFGenerator
  attr_reader :flight_offset

  def initialize(attributes)
    @flight_offset = attributes[:flight_offset]
  end

  def generate_pdf
    I18n.with_locale(:sv) do
      WickedPdf.new.pdf_from_string(
        ApplicationController.render(
          template: 'pdfs/flight_offset_certificate',
          layout: false,
          assigns: {
            flight_offset: @flight_offset
          }
        ),
        orientation: 'portrait'
      )
    end
  end
end
