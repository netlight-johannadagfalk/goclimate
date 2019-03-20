# frozen_string_literal: true

class SubscriptionMonthReceipt
  attr_reader :stripe_event

  def initialize(stripe_event)
    @stripe_event = stripe_event
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
    stripe_event.created_at.to_date
  end

  def currency
    stripe_event.currency
  end

  def total_amount
    stripe_event.stripe_amount.to_d / 100
  end

  def vat_amount
    (total_amount * (1 - (1 / BigDecimal('1.25')))).round(2)
  end

  def total_amount_before_vat
    total_amount - vat_amount
  end
end
