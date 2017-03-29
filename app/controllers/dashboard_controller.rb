class DashboardController < ApplicationController

  before_action :authenticate_user!

  def index
  	@total = StripeEvent.where(stripe_object: "charge").sum("stripe_amount").to_i / 100

    @total_contributed = StripeEvent.where(stripe_object: "charge").where(stripe_customer_id: current_user.stripe_customer_id).sum("stripe_amount").to_i / 100
  end
end
