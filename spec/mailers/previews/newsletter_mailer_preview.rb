# frozen_string_literal: true

# Preview all emails at http://localhost:3000/rails/mailers/
class NewsletterMailerPreview < ActionMailer::Preview
  def newsletter_signup_email
    NewsletterMailer.newsletter_signup_email('test@email.com')
  end

  def business_newsletter_signup_email
    NewsletterMailer.business_newsletter_signup_email('test@email.com')
  end
end
