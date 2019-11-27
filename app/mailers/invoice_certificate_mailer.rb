# frozen_string_literal: true

class InvoiceCertificateMailer < ApplicationMailer
  default asm: { group_id: SENDGRID_ASM_GROUP_IDS[:invoice_certificates] }

  def invoice_certificate_email
    attachments["GoClimateNeutral Offset Certificate - #{params[:reciever]}.pdf"] = params[:certificate_pdf]

    mail(
      to: params[:email],
      subject: 'Ditt certifikat från GoClimateNeutral'
    )
  end
end
