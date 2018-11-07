# frozen_string_literal: true

# Preview all emails at http://localhost:3000/rails/mailers/subscription_mailer
class SubscriptionMailerPreview < ActionMailer::Preview
  def one_more_month_email
    SubscriptionMailer.with(email: User.where('stripe_customer_id is not null').first.email).one_more_month_email
  end

  def one_more_year_email
    SubscriptionMailer.with(email: User.where('stripe_customer_id is not null').first.email).one_more_year_email
  end

  def payment_failed_email
    SubscriptionMailer.with(email: User.where('stripe_customer_id is not null').first.email).payment_failed_email
  end
end
