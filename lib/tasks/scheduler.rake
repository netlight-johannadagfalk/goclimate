# frozen_string_literal: true

task update_stripe_events: :environment do
  puts 'Processing Stripe events...'
  StripeEventsConsumer.new.fetch_and_process
  puts 'done.'
end
