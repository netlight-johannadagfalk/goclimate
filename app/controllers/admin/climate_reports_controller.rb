# frozen_string_literal: true

module Admin
  class ClimateReportsController < AdminController
    def index
      climate_reports =
        ClimateReportInvoice.where(id: invoices_param).includes(climate_report: :calculation).map(&:climate_report)

      respond_to do |format|
        format.csv { send_data ClimateReportExport.new(climate_reports).to_csv, mime: Mime[:csv] }
      end
    end

    private

    def invoices_param
      if params[:invoices].include?('-')
        Range.new(*params[:invoices].split('-').map(&:to_i))
      else
        params[:invoices].to_i
      end
    end
  end
end
