# frozen_string_literal: true

class LifestyleFootprintsController < ApplicationController
  before_action :set_footprint, only: [:show, :destroy]
  before_action :authenticate_user!, only: [:index]

  def index
    @footprints = LifestyleFootprint.where(user_id: current_user.id).order(created_at: :desc)
  end

  def new
    (country = ISO3166::Country.new(params[:country])) &&
      (@calculator = LifestyleCalculator.find_published_for_country(country))

    render_not_found && return unless @calculator.present?

    @footprint = LifestyleFootprint.new(lifestyle_calculator: @calculator, country: params[:country])
  end

  def create
    @footprint = LifestyleFootprint.new(footprint_params)
    @footprint.update_from_lifestyle_calculator
    @footprint.user = current_user
    @footprint.save!

    if current_user
      redirect_to lifestyle_footprint_path(id: @footprint)
      return
    end

    redirect_to new_registration_path(:user, lifestyle_footprint: @footprint, campaign: params[:campaign].presence)
  end

  def show
    @country_average = LifestyleFootprintAverage.find_by_country(@footprint.country)
    @total_number_of_footprints = LifestyleFootprint.where(user_id: current_user.id).count if current_user.present?
  end

  def destroy
    @footprint.destroy
    flash[:notice] = 'Your carbon footprint calculation was deleted sucessfully.'
    redirect_to dashboard_path
  end

  private

  def set_footprint
    @footprint = LifestyleFootprint.find_by_key!(params[:id])
  end

  def footprint_params
    params.require(:lifestyle_footprint).permit(
      :lifestyle_calculator_id, :country, :region_answer, :home_answer,
      :home_area_answer, :heating_answer, :green_electricity_answer,
      :food_answer, :shopping_answer, :car_type_answer, :flight_hours_answer
    ).tap do |p|
      p[:car_distance_answer] = (params[:car_distance_week_answer].presence&.to_i || 0) * 52
      p[:flight_hours_answer] = 0 unless p[:flight_hours_answer].present?
    end
  end
end
