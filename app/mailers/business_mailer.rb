# frozen_string_literal: true

class BusinessMailer < ApplicationMailer
  helper :application

  def employee_offset_notice_email(reply_to, number_of_employees, language)
    mail(
      to: 'hello@goclimateneutral.org',
      reply_to: reply_to,
      subject: 'Intresseanmälan från företag som vill klimatkompensera',
      body: "Intresseanmälan från: #{reply_to}, för #{number_of_employees} antal anställda, språk: #{language}"
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
      to: 'hello@goclimateneutral.org',
      reply_to: @climate_report.contact_email,
      subject: "#{@climate_report.company_name} vill klimatkompensera"
    )
  end
end
