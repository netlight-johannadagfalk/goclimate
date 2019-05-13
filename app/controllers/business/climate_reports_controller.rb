# frozen_string_literal: true

module Business
  class ClimateReportsController < ApplicationController
    before_action :force_en_locale # Business pages are English only for now

    def show
      @report = ClimateReport.find_by_key!(params[:key])
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

      redirect_to action: :show, key: @report.key
    end

    private

    def climate_report_params
      params.require(:climate_report).permit(
        :company_name, :contact_email, :employees, :country,
        :calculation_period, :electricity_consumption, :heating,
        :number_of_servers, :flight_hours, :car_distance, :meals,
        :meals_vegetarian_share, :purchased_computers, :purchased_phones,
        :purchased_monitors, :other_co2e
      )
    end
  end
end
