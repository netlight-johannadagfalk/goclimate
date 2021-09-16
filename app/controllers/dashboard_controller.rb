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
    @current_user = current_user

    @footprint = current_user.current_lifestyle_footprint
    # Some old users don't have LifestyleFootprints
    @country_average = LifestyleFootprintAverage.find_by_country(@footprint.country) if @footprint.present?

    @user_top_list = user_top_list
    @country_top_list = country_top_list

    @projects = Project.all.order(created_at: :desc).limit(5)

    @total_number_of_footprints = LifestyleFootprint.where(user_id: current_user.id).count

    @climate_actions = ClimateAction.all
    @climate_actions_categories = ClimateActionCategory.all
    @climate_user_action = UserClimateAction.all

    # Functions get climate actions
    @get_all_user_climate_actions = ClimateAction.joins(:user_climate_actions)
    .where(["user_climate_actions.user_id = ? and climate_actions.id = user_climate_actions.climate_action_id", current_user.id])
    .select("user_climate_actions.id", :climate_action_id, :name, :description, :status, :user_id, :climate_action_category_id, :image_url)

    # @get_all_climate_actions_without_user_actions = ClimateAction.where.not(id: UserClimateAction.where(user_id: current_user.id).select(:climate_action_id))
    # @get_all_climate_actions_with_user_actions = ClimateAction.where(id: UserClimateAction.where(user_id: current_user.id).select(:climate_action_id))
    
@get_all_climate_actions_without_user_actions =
      ClimateAction.where.not(id: UserClimateAction.where(user_id: current_user.id).select(:climate_action_id))
      .joins("LEFT JOIN user_climate_actions ON user_climate_actions.climate_action_id = climate_actions.id")
      .select("climate_actions.*, COUNT(user_climate_actions.climate_action_id) AS total")
      .group("climate_actions.id")
    
    @get_all_climate_actions_with_user_actions =
      ClimateAction.where(id: UserClimateAction.where(user_id: current_user.id).select(:climate_action_id))
      .joins(:user_climate_actions)
      .select("climate_actions.*, COUNT(user_climate_actions.climate_action_id) AS total")
      .group("climate_actions.id")

    #@all_actions_with_accepted_user_actions = ClimateAction.right_outer_joins(:user_climate_actions)
    #.where(["user_climate_actions.user_id = ?", current_user.id])
    #.select("user_climate_actions.id", :climate_action_id, :name, :description, :status, :user_id)

    #@all_actions_with_accepted_user_actions = @get_all_user_climate_actions + @get_all_climate_actions_without_user_actions
  
    #@all_actions_with_accepted_user_actions = ClimateAction.where()
    
    #Done = True
    #Status = True
    #@getAllDoneActions = UserClimateAction.where(["user_climate_actions.user_id = ? and user_climate_actions.status = ?", current_user.id, true]).select("*")
    #Accepted = True
    #Status = False
    #@getAllAcceptedActions = UserClimateAction.where(["user_climate_actions.user_id = ? and user_climate_actions.status = ?", current_user.id, false]).select("*")
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
