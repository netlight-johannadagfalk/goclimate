# frozen_string_literal: true

class WelcomeController < ApplicationController
  def index
    @unique_climate_neutral_users = User.with_active_subscription.count
    @total_carbon_offset = Project.total_carbon_offset
    @lifestyle_choice_co2 = LifestyleChoice.lifestyle_choice_co2
    @latest_project = Project.order(date_bought: :desc).first
  end

  def about
  end

  def business
    @cost_per_tonne = cost_per_tonne
  end

  def contact
  end

  def faq
  end

  def press
    @press_images = Dir.glob('app/assets/images/press/*.*')
    @press_social_images = Dir.glob('app/assets/images/press_social/*.*')
  end

  def transparency
    @unique_climate_neutral_users = User.with_active_subscription.count
    @total_carbon_offset = Project.total_carbon_offset
    @number_of_countries = User.distinct.pluck(:country).compact.count
    @number_of_businesses_helped = Invoice.distinct.pluck(:receiver).count +
                                   ClimateReport.distinct.pluck(:company_name).count
  end

  def privacy_policy
  end

  def travel_calculator
  end
end
