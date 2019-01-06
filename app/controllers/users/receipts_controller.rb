# frozen_string_literal: true

module Users
  class ReceiptsController < ApplicationController
    def index
      @receipts = current_user.stripe_events.map { |se| Receipt.new(se) }
    end

    def show
      receipt = Receipt.new(StripeEvent.find(params[:stripe_event_id]))
      render template: 'pdfs/receipt', layout: false, assigns: { receipt: receipt }
    end

    def download
      receipt = Receipt.new(StripeEvent.find(params[:stripe_event_id]))
      pdf = receipt.generate_pdf
      send_data pdf, filename: 'receipt.pdf', type: :pdf
    end
  end
end
