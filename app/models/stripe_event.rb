class StripeEvent < ApplicationRecord

  belongs_to :user, class_name: "User", primary_key: "stripe_customer_id", foreign_key: "stripe_customer_id"
  
  scope :payments, ->(user = nil) { where(stripe_object: "charge").where(stripe_customer_id: user.stripe_customer_id) }

  def self.total_payments_usd_part
    StripeEvent.where(stripe_object: "charge").where(paid: true).where(currency: "usd").sum("stripe_amount").to_i / 100
  end

  def self.total_payments_sek_part
    StripeEvent.where(stripe_object: "charge").where(paid: true).where(currency: "sek").sum("stripe_amount").to_i / 100 
  end

  def self.total_in_sek
    (total_payments_sek_part + total_payments_usd_part * 8.7).round
  end

  def self.total_in_usd
    (total_payments_usd_part + total_payments_sek_part / 8.7).round
  end

  def self.try_updating_events user
    tries = 0
    loop do 
      tries += 1
      StripeEvent.update_events
      break if StripeEvent.payments(user).count != 0 || tries > 3
      sleep(5)
    end 
  end

  def self.update_events
    require "stripe"
    Stripe.api_key = ENV['SECRET_KEY']

    list = Stripe::Event.list(limit: 1000)

    list["data"].each do |e| 

      event_object = e.data.object
      
      paid_charge = event_object.object == "charge" && event_object.paid == true
      failed_charge = event_object.object == "charge" && event_object.paid == false

      if (paid_charge || failed_charge) && StripeEvent.where(stripe_event_id: event_object.id).empty?
        if !User.find_by_stripe_customer_id(event_object.customer).nil?

          StripeEvent.create( 
            stripe_event_id: event_object.id,
            stripe_customer_id: event_object.customer, 
            stripe_object: event_object.object,
            stripe_amount: event_object.amount,
            paid: event_object.paid,
            currency: event_object.currency,
            stripe_created: event_object.created
          )
          u = User.find_by_stripe_customer_id event_object.customer
          if paid_charge
            #Mailer.new.send_one_more_month_email u
          elsif failed_charge
            #Mailer.new.send_payment_failed_email u
          end
        end
      end
    end
  end


  def self.update_stripe_charges

    require "stripe"
    Stripe.api_key = ENV['SECRET_KEY']
    i = 0
    starting_after = 0
    usd = 0
    sek = 0

    list = Stripe::Charge.list(limit: 100)

    while !list["data"].empty?

      list["data"].each do |event_object| 

        if event_object.paid == true
          if event_object.currency == "usd"
            usd += event_object.amount
          elsif event_object.currency == "sek"
            sek += event_object.amount
          end
        end

        if event_object.object == "charge" && StripeEvent.where(stripe_event_id: event_object.id).empty?
          StripeEvent.create( 
            stripe_event_id: event_object.id,
            stripe_customer_id: event_object.customer, 
            stripe_object: event_object.object,
            stripe_amount: event_object.amount,
            paid: event_object.paid,
            currency: event_object.currency,
            stripe_created: event_object.created
          )
        end

        starting_after = event_object.id
        i = i +1
        puts i
      end

      list = Stripe::Charge.list(limit: 100, starting_after: starting_after)
    end

    puts usd 
    puts sek

    total = usd * 7.5 + sek

    puts "sek: " + total.to_s

  end

end



