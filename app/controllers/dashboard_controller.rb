class DashboardController < ApplicationController

  before_action :authenticate_user!

  def index
  	@total = StripeEvent.where(stripe_object: "charge").sum("stripe_amount").to_i / 100

    @my_amount_invested = StripeEvent.where(stripe_object: "charge").where(stripe_customer_id: current_user.stripe_customer_id).sum("stripe_amount").to_i / 100

    @my_neutral_months = StripeEvent.where(stripe_object: "charge").where(stripe_customer_id: current_user.stripe_customer_id).count

    @unique_climate_neutral_users = User.distinct.pluck(:stripe_customer_id).count

    @total_climate_neutral_months = StripeEvent.where(stripe_object: "charge").count

    @user_top_list = User.left_joins(:stripe_events).select("users.id, COUNT(1)").group("users.id").order('COUNT(1) DESC').limit(10)

    @country_top_list = User.left_joins(:stripe_events).select("users.country, COUNT(1)").group("users.country").order('COUNT(1) DESC').limit(10)
  end
end