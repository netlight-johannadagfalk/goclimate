# frozen_string_literal: true

module Business
  class ClimateReportsController < ApplicationController
    def show
      @report = ClimateReport.find_by_key!(params[:key])
      respond_to do |format|
        format.html do
          @invoice = ClimateReportInvoice.new(climate_report: @report).tap(&:calculate_from_report)
          @projects = Project.order(id: :desc).limit(2)
        end
        format.pdf do
          I18n.with_locale(:sv) do
            pdf = ClimateReportPdf.new(@report)
            filename = "#{@report.company_name} climate report - #{@report.calculation_period}.pdf"
            send_data(pdf.render, filename: filename, type: :pdf)
          end
        end
      end
    end

    def new
      @report = ClimateReport.new(calculation_period: '2018', calculation_period_length: 'year', country: 'SE')

      return unless params[:based_on].present? && (report_base = ClimateReport.find_by_key(params[:based_on]))

      @report.attributes = @report.attributes.merge(report_base.attributes)
    end

    def create
      @report = ClimateReport.new(climate_report_params)

      unless @report.save
        render :new
        return
      end

      ClimateReportCalculation.create_from_climate_report!(@report)
      BusinessMailer.with(climate_report: @report, region: current_region).climate_report_email.deliver_now

      redirect_to action: :show, key: @report.key
    end

    private

    def climate_report_params
      params.require(:climate_report).permit(
        :company_name, :contact_email, :employees, :office_area, :country,
        :calculation_period, :calculation_period_length,
        :consent_to_show_publicly, :electricity_consumption,
        :use_electricity_averages, :green_electricity, :heating,
        :use_heating_averages, :number_of_servers, :servers_green_electricity,
        :number_of_cloud_servers, :cloud_servers_green_electricity,
        :flight_hours, :car_distance, :meals, :meals_vegetarian_share,
        :purchased_computers, :purchased_phones, :purchased_monitors,
        :other_co2e, :other_specification
      )
    end
  end
end
