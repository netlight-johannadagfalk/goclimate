class StripeEvent < ApplicationRecord
  
  def update_events
    require "stripe"
    Stripe.api_key = ENV['SECRET_KEY']

    list = Stripe::Event.list(limit: 1000)

    list["data"].each do |e| 
      puts e.data.object.object
      event_object = e.data.object
      if event_object.object == "charge" && StripeEvent.where(stripe_event_id: event_object.id).empty?
        StripeEvent.create( 
          stripe_event_id: event_object.id,
          stripe_customer_id: event_object.customer, 
          stripe_object: event_object.object,
          stripe_amount: event_object.amount,
          stripe_created: event_object.created
        )
      end
    end
  end
end
