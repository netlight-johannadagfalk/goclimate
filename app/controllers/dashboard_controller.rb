# frozen_string_literal: true

require 'uri'

class DashboardController < ApplicationController
  before_action :authenticate_user!
  before_action :flash_when_registered

  def index
    @total_carbon_offset = Project.total_carbon_offset
    @my_amount_invested_sek = my_amount_invested_sek
    @my_carbon_offset = (@my_amount_invested_sek / LifestyleChoice::SEK_PER_TONNE.to_f).round(1)
    @my_neutral_months = my_neutral_months
    @unique_climate_neutral_users = User.with_active_subscription.count

    @user_top_list = user_top_list
    @country_top_list = country_top_list

    @projects = Project.all.order(created_at: :desc).limit(5)
  end

  private

  def flash_when_registered
    flash.now[:notice] = t('devise.registrations.signed_up') if params[:registered]
  end

  def my_amount_invested_sek
    (
      my_amount_invested_sek_part +
      my_amount_invested_usd_part * Currency::SEK_PER_USD +
      my_amount_invested_eur_part * Currency::SEK_PER_EUR
    ).round
  end

  def my_amount_invested_sek_part
    current_user.card_charges.for_subscriptions.paid.in_sek.sum('amount').to_i / 100
  end

  def my_amount_invested_usd_part
    current_user.card_charges.for_subscriptions.paid.in_usd.sum('amount').to_i / 100
  end

  def my_amount_invested_eur_part
    current_user.card_charges.for_subscriptions.paid.in_eur.sum('amount').to_i / 100
  end

  def my_neutral_months
    months = current_user.number_of_neutral_months
    months == 0 ? 1 : months
  end

  def user_top_list
    User.where("users.stripe_customer_id != ''")
        .left_joins(:card_charges)
        .where('card_charges.paid = true')
        .where("users.user_name is not null and users.user_name != ''")
        .select('users.id, users.user_name, COUNT(1)')
        .group('users.id')
        .order(Arel.sql('COUNT(1) DESC'))
        .limit(1000)
  end

  def country_top_list
    User.where("users.stripe_customer_id != ''")
        .left_joins(:card_charges)
        .where('card_charges.paid = true')
        .select('users.country, COUNT(1)')
        .group('users.country')
        .order(Arel.sql('COUNT(1) DESC'))
  end
end
