task :update_stripe_events => :environment do
  puts "Update StripeEvents..."
  StripeEvent.new.update_events
  puts "done."
end