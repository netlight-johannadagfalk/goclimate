# frozen_string_literal: true

class GiftCardCertificatePdf
  attr_reader :gift_card, :example

  def initialize(gift_card, example: false)
    @gift_card = gift_card
    @example = example
  end

  def render
    WickedPdf.new.pdf_from_string(
      ApplicationController.render(
        template: 'pdfs/gift_card',
        layout: false,
        assigns: {
          gift_card: @gift_card,
          example: @example
        }
      ),
      orientation: 'portrait'
    )
  end
end
