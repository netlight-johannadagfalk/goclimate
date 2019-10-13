# frozen_string_literal: true

class InvoiceCertificateMailer < ApplicationMailer
  helper :application

  def flight_offset_email
    @offset = params[:flight_offset]

    attachments['GoClimateNeutral Offset Certificate.pdf'] = params[:certificate_pdf]

    mail(
      to: @offset.email,
      subject: I18n.t('mailers.flight_offset.subject')
    )
  end
end
