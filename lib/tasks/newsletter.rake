# frozen_string_literal: true

namespace :newsletter do
  desc <<~TEXT
    prints csv content of swedish emails to be imported in sendgrid for newsletter list. Usage: 'rake newsletter:swedish_emails['2018-07-13']' where 2018-07-13 is the last import"
  TEXT
  task :swedish_emails, [:from_date] => [:environment] do |_, args|
    latest_added_users = User.where("created_at > '" + args[:from_date] + "'")

    swedish_users = latest_added_users.map do |u|
      if u.card_charges.first.nil?
        u.email
      elsif u.language == :sv
        u.email
      end
    end.compact

    csv_content = "email\n"
    swedish_users.each do |email|
      csv_content += email + "\n"
    end

    print csv_content
    p swedish_users.count
  end

  desc 'renders newsletter emails for english csv file'
  task :other_emails, [:from_date] => [:environment] do |_, args|
    latest_added_users = User.where("created_at > '" + args[:from_date] + "'")

    other_users = latest_added_users.map do |u|
      if u.card_charges.first.nil?
        nil
      elsif u.language != :sv
        u.email
      end
    end.compact

    csv_content = "email\n"
    other_users.each do |email|
      csv_content += email + "\n"
    end

    print csv_content
    p other_users.count
  end
end
