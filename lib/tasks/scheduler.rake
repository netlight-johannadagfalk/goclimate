# frozen_string_literal: true

task update_stripe_events: :environment do
  puts 'Update StripeEvents...'
  StripeEvent.update_events
  puts 'done.'
end

task update_stripe_payouts: :environment do
  puts 'Update StripePayouts...'
  StripePayout.update_payouts
  puts 'done.'
  puts((StripePayout.sum(:amount) / 100).to_s + ' sek in payouts from Stripe')
end
