# frozen_string_literal: true

require 'uri'

class DashboardController < ApplicationController
  before_action :authenticate_user!
  before_action :flash_when_registered

  def show
    @total_carbon_offset = OffsettingStatistics.new.total_sold.tonnes.round
    @my_carbon_offset = current_user.total_subscription_offsetting.tonnes
    @my_neutral_months = current_user.number_of_neutral_months
    @total_users = User.count

    @footprint = current_user.current_lifestyle_footprint
    # Some old users don't have LifestyleFootprints
    @country_average = LifestyleFootprintAverage.find_by_country(@footprint.country) if @footprint.present?

    @user_top_list = user_top_list
    @country_top_list = country_top_list

    @projects = Project.all.order(created_at: :desc).limit(5)
  end

  private

  def flash_when_registered
    flash.now[:notice] = t('devise.registrations.signed_up') if params[:subscribed]
    flash.now[:notice] = t('devise.registrations.signed_up_without_subscription') if params[:registered]
  end

  def user_top_list
    User
      .left_joins(:subscription_months)
      .where("users.user_name is not null and users.user_name != ''")
      .select('users.id, users.user_name, COUNT(1)')
      .group('users.id')
      .order(Arel.sql('COUNT(1) DESC'))
      .limit(1000)
  end

  def country_top_list
    User
      .left_joins(:subscription_months)
      .select('users.country, COUNT(1)')
      .group('users.country')
      .order(Arel.sql('COUNT(1) DESC'))
  end
end
