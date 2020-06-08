# frozen_string_literal: true

class HomeController < ApplicationController
  def show
    @unique_climate_neutral_users = User.with_active_subscription.count
    @total_carbon_offset = Project.total_carbon_offset
    @lifestyle_choice_co2 = LifestyleChoice.lifestyle_choice_co2
    @latest_project = Project.order(date_bought: :desc).first
  end
end
