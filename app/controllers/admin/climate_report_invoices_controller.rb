# frozen_string_literal: true

module Admin
  class ClimateReportInvoicesController < AdminController
    before_action :set_invoice, only: [:show]

    # GET /invoices
    def index
      @invoices = ClimateReportInvoice.all.order(:id)
    end

    # GET /invoices/1
    def show
    end

    private

    # Use callbacks to share common setup or constraints between actions.
    def set_invoice
      @invoice = ClimateReportInvoice.find(params[:id])
    end
  end
end
