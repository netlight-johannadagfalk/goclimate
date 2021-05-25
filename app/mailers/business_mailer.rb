# frozen_string_literal: true

class BusinessMailer < ApplicationMailer
  helper :application

  def contact_email(contact)
    mail(
      to: 'hello@goclimate.com',
      reply_to: contact.email,
      subject: contact.subject_line,
      body: contact.message_with_metadata
    )
  end

  def climate_report_email
    @climate_report = params[:climate_report]
    @region = params[:region]

    mail(
      to: @climate_report.contact_email,
      subject: I18n.t('mailers.business.climate_report_email.subject')
    )
  end

  def business_signup_notice_email(climate_report)
    @climate_report = climate_report

    mail(
      to: 'hello@goclimate.com',
      reply_to: @climate_report.contact_email,
      subject: "#{@climate_report.company_name} vill klimatkompensera"
    )
  end
end
