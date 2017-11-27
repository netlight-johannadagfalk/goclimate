task :update_stripe_events => :environment do
  puts "Update StripeEvents..."
  StripeEvent.update_events
  puts "done."
end
