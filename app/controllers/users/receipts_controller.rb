# frozen_string_literal: true

module Users
  class ReceiptsController < ApplicationController
    before_action :authenticate_user!, only: [:index]
    before_action :set_receipt, only: [:show]
    before_action :authorize_receipt, only: [:show]

    def index
      receipts = current_user.stripe_events
                             .paid_charges
                             .order(created_at: :desc)
      @receipts = receipts.map do |stripe_events|
        SubscriptionMonthReceiptPdf.new(stripe_events)
      end
    end

    def show
      send_data @receipt.render, filename: 'receipt.pdf', type: :pdf
    end

    private

    def set_receipt
      @receipt = SubscriptionMonthReceiptPdf.new(StripeEvent.find(params[:stripe_event_id]))
    end

    def authorize_receipt
      render_not_found unless current_user&.stripe_customer_id == @receipt.stripe_event.stripe_customer_id
    end
  end
end
