# frozen_string_literal: true

class GiftCardReceiptPdf
  attr_reader :gift_card

  def initialize(gift_card)
    @gift_card = gift_card
  end

  def render
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
    gift_card.currency.iso_code
  end

  def total_amount
    gift_card.price_incl_taxes.amount
  end

  def vat_amount
    gift_card.vat_amount.amount
  end

  def total_amount_before_vat
    gift_card.price.amount
  end

  def order_id
    gift_card.order_id
  end
end
