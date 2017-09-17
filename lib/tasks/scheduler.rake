task :update_stripe_events => :environment do
  puts "Update StripeEvents..."
  StripeEvent.update_events
  puts "done."
end

task :update_stripe_charges => :environment do
  puts "Update StripeCharges..."
  StripeEvent.update_stripe_charges
  puts "done."
end