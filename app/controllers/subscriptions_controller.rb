class SubscriptionsController < ApplicationController
  
  def new
  	@plan = params[:plan] || 5
  end

  def create
  	require "stripe"

  	@stripeToken = params[:stripeToken]
  	@stripeEmail = params[:stripeEmail]

	begin
		@plan = params[:plan] || 5
		plan_id = "climate_offset_" + @plan.to_s + "_monthly"
		plan_name = "Climate Offset " + @plan.to_s + " Monthly"


		customer = Stripe::Customer.create(
		    :email => params[:stripeEmail],
		    :source  => params[:stripeToken]
		)

		begin
			plan = Stripe::Plan.retrieve(plan_id)
		rescue
			
			begin 
				plan = Stripe::Plan.create(
				  :name => plan_name,
				  :id => plan_id,
				  :interval => "month",
				  :currency => "usd",
				  :amount => @plan.to_s + "00"
				)
			rescue
				flash[:error] = e.message
  				redirect_to new_subscrition_path
  			end
		end

		Stripe::Subscription.create(
		  :customer => customer.id,
		  :plan => plan.id,
		)

	rescue Stripe::CardError => e
  		flash[:error] = e.message
  		redirect_to new_subscription_path
	end
  end
end
