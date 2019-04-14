# frozen_string_literal: true

class GiftCardReceipt
  attr_reader :gift_card

  def initialize(gift_card)
    @gift_card = gift_card
  end

  def generate_pdf
    WickedPdf.new.pdf_from_string(
      ApplicationController.render(
        template: 'pdfs/receipt',
        layout: false,
        assigns: {
          receipt: self
        }
      ),
      orientation: 'portrait'
    )
  end

  def date
    gift_card.created_at.to_date
  end

  def currency
    curency
  end

  def total_amount
    gift_card.price
  end

  def vat_amount
    (total_amount * (1 - (1 / BigDecimal('1.25')))).round(2)
  end

  def total_amount_before_vat
    total_amount - vat_amount
  end

  def order_id
    gift_card.order_id
  end
end
