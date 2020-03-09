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

    p 'Wrote ' + swedish_users.count.to_s + ' emails to swedish_emails.csv'
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

    p 'Wrote ' + english_users.count.to_s + ' emails to english_emails.csv'
  end
end
