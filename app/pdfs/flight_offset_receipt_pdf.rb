# frozen_string_literal: true

class FlightOffsetReceiptPdf
  attr_reader :flight_offset

  def initialize(flight_offset)
    @flight_offset = flight_offset
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
    flight_offset.created_at.to_date
  end

  def currency
    flight_offset.currency
  end

  def total_amount
    flight_offset.price_incl_taxes.amount
  end

  def vat_amount
    flight_offset.vat_amount.amount
  end

  def total_amount_before_vat
    flight_offset.price.amount
  end

  def order_id
    flight_offset.order_id
  end
end
