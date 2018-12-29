# frozen_string_literal: true

require 'uri'

class DashboardController < ApplicationController
  before_action :authenticate_user!

  def index
    @total_carbon_offset = Project.total_carbon_offset

    my_amount_invested_usd_part =
      StripeEvent.payments(current_user).where(paid: true).where(currency: 'usd').sum('stripe_amount').to_i / 100
    my_amount_invested_sek_part =
      StripeEvent.payments(current_user).where(paid: true).where(currency: 'sek').sum('stripe_amount').to_i / 100
    my_amount_invested_eur_part =
      StripeEvent.payments(current_user).where(paid: true).where(currency: 'eur').sum('stripe_amount').to_i / 100

    @my_amount_invested_sek =
      (
        my_amount_invested_sek_part + my_amount_invested_usd_part * LifestyleChoice::SEK_PER_USD +
        my_amount_invested_eur_part * LifestyleChoice::SEK_PER_EUR
      ).round

    @my_carbon_offset = (@my_amount_invested_sek / LifestyleChoice::SEK_PER_TONNE.to_f).round(1)

    @my_neutral_months = StripeEvent.payments(current_user).where(paid: true).count
    @my_neutral_months = 1 if @my_neutral_months == 0

    @unique_climate_neutral_users = User.with_active_subscription.count

    @user_top_list = User.where("users.stripe_customer_id != ''")
                         .left_joins(:stripe_events)
                         .where('stripe_events.paid = true')
                         .select('users.id, users.user_name, COUNT(1)')
                         .group('users.id')
                         .order(Arel.sql('COUNT(1) DESC'))

    @country_top_list = User.where("users.stripe_customer_id != ''")
                            .left_joins(:stripe_events)
                            .where('stripe_events.paid = true')
                            .select('users.country, COUNT(1)')
                            .group('users.country')
                            .order(Arel.sql('COUNT(1) DESC'))

    @projects = Project.all.order(created_at: :desc).limit(5)
  end
end
