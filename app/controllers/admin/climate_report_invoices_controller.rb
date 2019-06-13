# frozen_string_literal: true

module Admin
  class ClimateReportInvoicesController < AdminController
    before_action :set_invoice, only: [:show, :set_project]

    # GET /invoices
    def index
      @invoices = ClimateReportInvoice.all.order(:id)
    end

    # GET /invoices/1
    def show
      @available_projects = Project.order(created_at: :desc).limit(5)
    end

    def set_project
      @invoice.update(project_id: params[:project_id])

      redirect_to [:admin, @invoice]
    end

    private

    # Use callbacks to share common setup or constraints between actions.
    def set_invoice
      @invoice = ClimateReportInvoice.find(params[:id])
    end
  end
end
