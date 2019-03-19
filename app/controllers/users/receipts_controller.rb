# frozen_string_literal: true

module Users
  class ReceiptsController < ApplicationController
    def index
      @receipts = current_user.stripe_events.map do |stripe_events|
        SubscriptionMonthReceipt.new(stripe_events)
      end
    end

    def show
      receipt = SubscriptionMonthReceipt.new(StripeEvent.find(params[:stripe_event_id]))
      send_data receipt.generate_pdf, filename: 'receipt.pdf', type: :pdf
    end
  end
end
