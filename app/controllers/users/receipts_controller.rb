# frozen_string_literal: true

module Users
  class ReceiptsController < ApplicationController
    before_action :set_receipt, only: [:show]
    before_action :authorize_receipt, only: [:show]

    def index
      @receipts = current_user.stripe_events.map do |stripe_events|
        SubscriptionMonthReceipt.new(stripe_events)
      end
    end

    def show
      send_data @receipt.generate_pdf, filename: 'receipt.pdf', type: :pdf
    end

    private

    def set_receipt
      @receipt = SubscriptionMonthReceipt.new(StripeEvent.find(params[:stripe_event_id]))
    end

    def authorize_receipt
      render_not_found unless current_user.stripe_customer_id == @receipt.stripe_event.stripe_customer_id
    end
  end
end
