task :update_stripe_events => :environment do
  puts "Update StripeEvents..."
  StripeEvent.update_events
  puts "done."
end

task :update_stripe_invoices => :environment do
  puts "Update StripeInvoices..."
  StripeEvent.update_stripe_invoices
  puts "done."
end