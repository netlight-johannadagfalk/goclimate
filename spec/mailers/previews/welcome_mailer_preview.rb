# frozen_string_literal: true

# Preview all emails at http://localhost:3000/rails/mailers/welcome_mailer
class WelcomeMailerPreview < ActionMailer::Preview
  def welcome_email
    WelcomeMailer.with(
      email: 'kalle@goclimateneutral.org'
    ).welcome_email
  end
end
