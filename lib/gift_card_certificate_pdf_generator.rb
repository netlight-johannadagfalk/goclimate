# frozen_string_literal: true

class GiftCardCertificatePDFGenerator
  attr_reader :message, :number_of_months, :example

  def self.from_certificate(certificate)
    new(
      message: certificate.message,
      number_of_months: certificate.number_of_months
    )
  end

  def initialize(attributes)
    @message = attributes[:message]
    @number_of_months = attributes[:number_of_months]
    @example = attributes[:example] || false
  end

  def generate_pdf
    WickedPdf.new.pdf_from_string(
      ApplicationController.render(
        template: 'pdfs/gift_card',
        layout: false,
        assigns: {
          message: @message,
          number_of_months: @number_of_months,
          example: @example
        }
      ),
      orientation: 'portrait'
    )
  end
end
