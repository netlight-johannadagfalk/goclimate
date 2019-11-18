# frozen_string_literal: true

module Users
  class ReceiptsController < ApplicationController
    before_action :authenticate_user!, only: [:index]
    before_action :set_receipt, only: [:show]
    before_action :authorize_receipt, only: [:show]

    def index
      charges = current_user.card_charges.paid_charges.order(created_at: :desc)

      @receipts = charges.map do |charge|
        SubscriptionMonthReceiptPdf.new(charge)
      end
    end

    def show
      send_data @receipt.render, filename: 'receipt.pdf', type: :pdf
    end

    private

    def set_receipt
      @receipt = SubscriptionMonthReceiptPdf.new(CardCharge.find(params[:card_charge_id]))
    end

    def authorize_receipt
      render_not_found unless current_user&.stripe_customer_id == @receipt.card_charge.stripe_customer_id
    end
  end
end
