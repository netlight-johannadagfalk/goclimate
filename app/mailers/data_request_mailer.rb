# frozen_string_literal: true

class DataRequestMailer < ApplicationMailer
  default asm: { group_id: SENDGRID_ASM_GROUP_IDS[:data_requests] }
  helper :application

  def data_request_email
    I18n.locale = params[:locale]
    mail(
      from: "#{I18n.t('mailers.welcome.from', name: params[:sender])} <#{params[:sender]&.downcase}@goclimate.com>",
      reply_to: "#{I18n.t('mailers.welcome.from', name: params[:sender])} <#{params[:sender]&.downcase}@goclimate.com>",
      to: params[:data_reporter].email,
      subject: params[:subject].present? ? params[:subject] : I18n.t('mailers.data_requests.subject')
    )
  end
end
