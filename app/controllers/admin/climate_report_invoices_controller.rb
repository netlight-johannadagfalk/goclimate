# frozen_string_literal: true

module Admin
  class ClimateReportInvoicesController < AdminController
    before_action :set_invoice, only: [:show, :edit, :update]

    # GET /invoices
    def index
      @invoices = ClimateReportInvoice.all.order(created_at: :desc)
    end

    # GET /invoices/1
    def show
      @available_projects = Project.order(created_at: :desc).limit(5)
      @previous = ClimateReportInvoice.where('created_at < ?', @invoice.created_at).order(created_at: :desc).first
      @next = ClimateReportInvoice.where('created_at > ?', @invoice.created_at).order(created_at: :asc).first
    end

    # GET /invoices/1/edit
    def edit
    end

    # PATCH/PUT /invoices/1
    # PATCH/PUT /invoices/1.json
    def update
      respond_to do |format|
        if @invoice.update(invoice_params)
          format.html { redirect_to [:admin, @invoice], notice: 'Climate Report Invoice was successfully updated.' }
          format.json { render :show, status: :ok, location: @invoice }
        else
          format.html { render :edit }
          format.json { render json: @invoice.errors, status: :unprocessable_entity }
        end
      end
    end

    private

    # Use callbacks to share common setup or constraints between actions.
    def set_invoice
      @invoice = ClimateReportInvoice.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def invoice_params
      params
        .require(:climate_report_invoice)
        .permit(:fortnox_id, :project_id, :certificate_sent_at, :certificate_reciever_email)
        .delete_if { |_, value| value.blank? }
        .tap { |params| params[:certificate_sent_at] = Time.now if params[:certificate_sent_at] == "now" }
    end
  end
end
