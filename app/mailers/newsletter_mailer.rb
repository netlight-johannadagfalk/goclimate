# frozen_string_literal: true

class NewsletterMailer < ApplicationMailer
  def newsletter_signup_email(email)
    mail(
      from: "#{I18n.t('mailers.welcome.from', name: 'Tove')} <tove@goclimate.com>",
      reply_to: "#{I18n.t('mailers.welcome.from', name: 'Tove')} <tove@goclimate.com>",
      to: email,
      subject: I18n.t('mailers.newsletter.sign_up.subject'),
      asm: { group_id: SENDGRID_ASM_GROUP_IDS[:newsletter] }
    )
  end

  def business_newsletter_signup_email(email)
    mail(
      to: email,
      from: "#{I18n.t('mailers.welcome.from', name: 'Tove')} <tove@goclimate.com>",
      reply_to: "#{I18n.t('mailers.welcome.from', name: 'Tove')} <tove@goclimate.com>",
      subject: I18n.t('mailers.business.newsletter_signup.subject'),
      asm: { group_id: SENDGRID_ASM_GROUP_IDS[:business_newsletter] }
    )
  end
end
