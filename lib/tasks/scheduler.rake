# frozen_string_literal: true

task update_stripe_events: :environment do
  puts 'Processing Stripe events...'
  StripeEventsConsumer.new.fetch_and_process
  puts 'done.'
end

task update_stripe_payouts: :environment do
  puts 'Update StripePayouts...'
  StripePayout.update_payouts
  puts 'done.'
  puts "#{StripePayout.sum(:amount) / 100} sek in payouts from Stripe"
end
