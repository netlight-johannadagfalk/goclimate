class StripeEvent < ApplicationRecord

  belongs_to :user, class_name: 'User', primary_key: 'stripe_customer_id', foreign_key: 'stripe_customer_id'
  
  scope :charges, ->(user = nil) { where(stripe_object: "charge").where(stripe_customer_id: user.stripe_customer_id) }

  def self.try_updating_events user
    tries = 0
    loop do 
      tries += 1
      StripeEvent.update_events
      break if StripeEvent.charges(user).count != 0 || tries > 3
      sleep(5)
    end 
  end

  def self.update_events
    require "stripe"
    Stripe.api_key = ENV['SECRET_KEY']

    list = Stripe::Event.list(limit: 1000)

    list["data"].each do |e| 
      puts e.data.object.object
      event_object = e.data.object
      if event_object.object == "charge" && StripeEvent.where(stripe_event_id: event_object.id).empty?
        if !User.find_by_stripe_customer_id(event_object.customer).nil?
          StripeEvent.create( 
            stripe_event_id: event_object.id,
            stripe_customer_id: event_object.customer, 
            stripe_object: event_object.object,
            stripe_amount: event_object.amount,
            currency: event_object.currency,
            stripe_created: event_object.created
          )
          # u = User.find_by_stripe_customer_id event_object.customer
          # Mailer.new.send_one_more_month_email u
          u = User.find_by_email "kalle@nilver.se"
          Mailer.new.send_one_more_month_email u
        end
      end
    end
  end
end
