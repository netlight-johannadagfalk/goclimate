# frozen_string_literal: true

class SubscriptionMonthReceiptPdf
  attr_reader :card_charge

  def initialize(card_charge)
    @card_charge = card_charge
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
    card_charge.created_at.to_date
  end

  def currency
    card_charge.currency
  end

  def total_amount
    card_charge.amount.to_d / 100
  end

  def vat_amount
    (total_amount * (1 - (1 / BigDecimal('1.25')))).round(2)
  end

  def total_amount_before_vat
    total_amount - vat_amount
  end

  def order_id
    card_charge.order_id
  end
end
