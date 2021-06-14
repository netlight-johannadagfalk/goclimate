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
    users = User.where("email like '%@nilver.se'")

    CSV.open('price_increase_emails.csv', 'w') do |csv|
      csv << ['email']
      users.each do |user|
        skip unless user.active_subscription?
        CONSUMER_PRICE_PER_TONNE = {
          Currency::AUD => Money.new(9_50, :aud),
          Currency::CAD => Money.new(8_70, :cad),
          Currency::DKK => Money.new(44_00, :dkk),
          Currency::EUR => Money.new(6_00, :eur),
          Currency::GBP => Money.new(5_00, :gbp),
          Currency::SEK => Money.new(60_00, :sek),
          Currency::USD => Money.new(7_00, :usd)
        }.freeze
        csv << [user.email, user.subscription_price * 1.5, CONSUMER_PRICE_PER_TONNE[user.currency]]
      end
    end

    p "Wrote #{users.count} emails to price_increase_emails.csv"
  end

end
