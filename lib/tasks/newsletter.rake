# frozen_string_literal: true

namespace :newsletter do
  desc 'prints csv content of all swedish emails to be imported in sendgrid for newsletter list'
  task swedish_emails: :environment do
    swedish_users = User.where(region: Region::Sweden)

    CSV.open('swedish_emails.csv', 'w') do |csv|
      csv << ['email']
      swedish_users.each do |user|
        csv << [user.email]
      end
    end

    p "Wrote #{swedish_users.count} emails to swedish_emails.csv"
  end

  desc 'prints csv content of all swedish emails to be imported in sendgrid for newsletter list'
  task english_emails: :environment do
    english_users = User.where.not(region: Region::Sweden)

    CSV.open('english_emails.csv', 'w') do |csv|
      csv << ['email']
      english_users.each do |user|
        csv << [user.email]
      end
    end

    p "Wrote #{english_users.count} emails to english_emails.csv"
  end

  desc 'prints csv content of all emails that needs info on price increase'
  task price_increase_emails: :environment do
    users = User.all.select(&:active_subscription?)

    CSV.open('price_increase_emails.csv', 'w') do |csv|
      csv << %w[email new_monthly_fee new_cost_per_tonne]
      users.each do |user|
        csv << [
          user.email,
          Subscriptions::Plan.for_footprint(user.current_plan.footprint, user.subscription_currency).price,
          CONSUMER_PRICE_PER_TONNE[user.subscription_currency]
        ]
      end
    end

    p "Wrote #{users.count} emails to price_increase_emails.csv"
  end
end
