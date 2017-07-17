class StripeEvent < ApplicationRecord

  belongs_to :user, class_name: 'User', primary_key: 'stripe_customer_id', foreign_key: 'stripe_customer_id'
  
  scope :invoices, ->(user = nil) { where(stripe_object: "invoice").where(stripe_customer_id: user.stripe_customer_id) }

  def self.try_updating_events user
    tries = 0
    loop do 
      tries += 1
      StripeEvent.update_events
      break if StripeEvent.invoices(user).count != 0 || tries > 3
      sleep(5)
    end 
  end

  def self.update_events
    require "stripe"
    Stripe.api_key = ENV['SECRET_KEY']

    list = Stripe::Event.list(limit: 1000)

    list["data"].each do |e| 

      event_object = e.data.object
      
      paid_invoice = event_object.object == "invoice" && event_object.paid == true
      failed_payment = event_object.object == "invoice" && event_object.paid == false && event_object.attempted == true

      if (paid_invoice || failed_payment) && StripeEvent.where(stripe_event_id: event_object.id).empty?
        if !User.find_by_stripe_customer_id(event_object.customer).nil?
          StripeEvent.create( 
            stripe_event_id: event_object.id,
            stripe_customer_id: event_object.customer, 
            stripe_object: event_object.object,
            stripe_amount: event_object.amount_due,
            paid: event_object.paid,
            currency: event_object.currency,
            stripe_created: event_object.date
          )
          u = User.find_by_stripe_customer_id event_object.customer
          if paid_invoice
            Mailer.new.send_one_more_month_email u
          elsif failed_payment
            Mailer.new.send_payment_failed_email u
          end
        end
      end
    end
  end

  def self.update_stripe_invoices

    require "stripe"
    Stripe.api_key = ENV['SECRET_KEY']
    i = 0
    starting_after = 0

    list = Stripe::Invoice.list(limit: 100)

    while !list["data"].empty?

      list["data"].each do |event_object| 

        if event_object.object == "invoice" && event_object.paid == true && StripeEvent.where(stripe_event_id: event_object.id).empty?
          if !User.find_by_stripe_customer_id(event_object.customer).nil?
            StripeEvent.create( 
              stripe_event_id: event_object.id,
              stripe_customer_id: event_object.customer, 
              stripe_object: event_object.object,
              stripe_amount: event_object.amount_due,
              currency: event_object.currency,
              stripe_created: event_object.date
            )
          end
        end

        starting_after = event_object.id
        i = i +1
        puts i
      end

      list = Stripe::Invoice.list(limit: 100, starting_after: starting_after)
    end

  end

end



