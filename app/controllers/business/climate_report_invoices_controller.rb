# frozen_string_literal: true

module Business
  class ClimateReportInvoicesController < ApplicationController
    before_action :force_en_locale # Business pages are English only for now

    def create
      @report = ClimateReport.find_by_key(params[:key])
      @invoice = ClimateReportInvoice.new(invoice_params)
      @invoice.calculate_from_report

      unless @invoice.save
        @projects = Project.order(id: :desc).limit(2)
        render template: 'business/climate_reports/show'
        return
      end

      redirect_to action: :thank_you
    end

    def thank_you
    end

    private

    def invoice_params
      params.require(:climate_report_invoice)
            .permit(
              :climate_report_id, :invoice_address, :vat_number, :invoice_email
            )
            .merge(climate_report: @report)
    end
  end
end
