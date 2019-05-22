# frozen_string_literal: true

module Business
  class ClimateReportsController < ApplicationController
    before_action :force_en_locale # Business pages are English only for now

    def show
      @report = ClimateReport.find_by_key!(params[:key])
      @invoice = ClimateReportInvoice.new(climate_report: @report)
                                     .tap(&:calculate_from_report)
      @projects = Project.order(id: :desc).limit(2)
    end

    def new
      @report = ClimateReport.new(calculation_period: '2018', country: 'SE')
    end

    def create
      @report = ClimateReport.new(climate_report_params)

      unless @report.save
        render :new
        return
      end

      ClimateReportCalculation.create_from_climate_report!(@report)

      redirect_to action: :show, key: @report.key
    end

    private

    def climate_report_params
      params.require(:climate_report).permit(
        :company_name, :contact_email, :employees, :office_area, :country,
        :calculation_period, :consent_to_show_publicly,
        :electricity_consumption, :use_electricity_averages,
        :green_electricity, :heating, :use_heating_averages,
        :number_of_servers, :servers_green_electricity,
        :number_of_cloud_servers, :cloud_servers_green_electricity,
        :flight_hours, :car_distance, :meals, :meals_vegetarian_share,
        :purchased_computers, :purchased_phones, :purchased_monitors,
        :other_co2e, :other_specification
      )
    end
  end
end
