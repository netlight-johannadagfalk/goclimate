class DashboardController < ApplicationController

  before_action :authenticate_user!

  def index

    if StripeEvent.charges(current_user).count == 0
      StripeEvent.try_updating_events current_user
    end

  	@total = StripeEvent.where(stripe_object: "charge").sum("stripe_amount").to_i / 100

    @my_amount_invested = StripeEvent.charges(current_user).sum("stripe_amount").to_i / 100

    @my_neutral_months = StripeEvent.charges(current_user).count
    @my_neutral_months = @my_neutral_months == 0 ? 1 : @my_neutral_months

    @unique_climate_neutral_users = User.distinct.pluck(:stripe_customer_id).count

    @total_climate_neutral_months = StripeEvent.where(stripe_object: "charge").count

    @user_top_list = User.where("users.stripe_customer_id != ''").left_joins(:stripe_events).select("users.id, COUNT(1)").group("users.id").order('COUNT(1) DESC').limit(10)

    @country_top_list = User.where("users.stripe_customer_id != ''").left_joins(:stripe_events).select("users.country, COUNT(1)").group("users.country").order('COUNT(1) DESC').limit(10)

    @projects = Project.all.order(created_at: :desc)

    @total_carbon_offset = Project.all.sum("carbon_offset")

  end
end