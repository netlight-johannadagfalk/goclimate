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

  # TODO: After price data has been migrated to always include VAT/non-VAT
  # subtotals, use those attributes directly instead of recalculating.
  def total_amount
    flight_offset.price_incl_taxes.subunit_amount.to_d / 100
  end

  def vat_amount
    (total_amount * (1 - (1 / BigDecimal('1.25')))).round(2)
  end

  def total_amount_before_vat
    total_amount - vat_amount
  end

  def order_id
    flight_offset.order_id
  end
end
