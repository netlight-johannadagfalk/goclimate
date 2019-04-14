# frozen_string_literal: true

class GiftCardReceiptsController < ApplicationController
  def show
    @receipt = GiftCardReceipt.new(GiftCard.find(params[:id]))
    send_data @receipt.generate_pdf, filename: 'receipt.pdf', type: :pdf
  end
end
