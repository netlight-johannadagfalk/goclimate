# frozen_string_literal: true

module Users
  class ReceiptsController < ApplicationController
    def index
      @receipts = current_user.stripe_events.map { |stripe_events| Receipt.new(stripe_events) }
    end

    def show
      receipt = Receipt.new(StripeEvent.find(params[:stripe_event_id]))
      send_data receipt.generate_pdf, filename: 'receipt.pdf', type: :pdf
    end
  end
end
