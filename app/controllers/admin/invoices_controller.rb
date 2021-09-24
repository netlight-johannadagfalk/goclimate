# frozen_string_literal: true

module Admin
  class InvoicesController < AdminController
    before_action :set_invoice, only: [:show, :edit, :update, :destroy]

    # GET /invoices
    # GET /invoices.json
    def index
      @invoices = Invoice.all.order(created_at: :desc)
    end

    # GET /invoices/1
    # GET /invoices/1.json
    def show
      @previous = Invoice.where('created_at < ?', @invoice.created_at).order(created_at: :desc).first
      @next = Invoice.where('created_at > ?', @invoice.created_at).order(created_at: :asc).first
    end

    # GET /invoices/new
    def new
      @invoice = Invoice.new
      @available_projects = Project.order(created_at: :desc).limit(10)
    end

    # GET /invoices/1/edit
    def edit
      @available_projects = Project.order(created_at: :desc)
    end

    # POST /invoices
    # POST /invoices.json
    def create
      @invoice = Invoice.new(invoice_params)

      respond_to do |format|
        if @invoice.save
          format.html { redirect_to admin_invoice_path(@invoice), notice: 'Invoice was successfully created.' }
          format.json { render :show, status: :created, location: @invoice }
        else
          format.html { render :new }
          format.json { render json: @invoice.errors, status: :unprocessable_entity }
        end
      end
    end

    # PATCH/PUT /invoices/1
    # PATCH/PUT /invoices/1.json
    def update
      respond_to do |format|
        if @invoice.update(invoice_params)
          format.html { redirect_to admin_invoice_path(@invoice), notice: 'Invoice was successfully updated.' }
          format.json { render :show, status: :ok, location: @invoice }
        else
          format.html { render :edit }
          format.json { render json: @invoice.errors, status: :unprocessable_entity }
        end
      end
    end

    # DELETE /invoices/1
    # DELETE /invoices/1.json
    def destroy
      @invoice.destroy
      respond_to do |format|
        format.html { redirect_to admin_invoices_url, notice: 'Invoice was successfully destroyed.' }
        format.json { head :no_content }
      end
    end

    private

    # Use callbacks to share common setup or constraints between actions.
    def set_invoice
      @invoice = Invoice.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def invoice_params
      params
        .require(:invoice)
        .tap do |params|
          params[:amount_in_sek] = money_param_to_subunit(params[:amount_in_sek])
          params[:offsetting_subtotal] = money_param_to_subunit(params[:offsetting_subtotal])
          params[:consulting_subtotal] = money_param_to_subunit(params[:consulting_subtotal])
          params[:products_subtotal] = money_param_to_subunit(params[:products_subtotal])
        end
        .permit(:amount_in_sek, :offsetting_subtotal, :consulting_subtotal, :products_subtotal, :co2e, :receiver,
                :project_id, :fortnox_id, :comment, :certificate_sent_at, :certificate_reciever_email)
        .transform_values { |value| value.blank? ? nil : value }
        .tap { |params| params[:certificate_sent_at] = Time.now if params[:certificate_sent_at] == 'now' }
    end

    def money_param_to_subunit(string)
      (string.to_d * 100).to_i if string.present?
    end
  end
end
