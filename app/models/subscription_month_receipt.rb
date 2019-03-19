# frozen_string_literal: true

class SubscriptionMonthReceipt
  attr_reader :date, :id, :amount, :currency

  def initialize(stripe_event)
    @id = stripe_event.id
    @amount = stripe_event.stripe_amount / 100
    @date = stripe_event.created_at.to_date
    @currency = stripe_event.currency
  end

  def generate_pdf
    WickedPdf.new.pdf_from_string(
      ApplicationController.render(
        template: 'pdfs/receipt',
        layout: false,
        assigns: {
          date: @date,
          currency: @currency,
          amount: @amount
        }
      ),
      orientation: 'portrait'
    )
  end
end
