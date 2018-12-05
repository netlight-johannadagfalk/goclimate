# frozen_string_literal: true

class GiftCardMailer < ApplicationMailer
  def gift_card_email
    email = params[:email]
    @number_of_months = params[:number_of_months]
    filename = params[:filename]

    attachments[filename] = File.read(@number_of_months + '_months_' + I18n.locale.to_s + '.pdf')
    mail(
      to: email,
      subject: I18n.t('gift_card_email_subject'),
      # TODO: Handle differing ASM groups in different enviornments
      asm: { group_id: Rails.env.staging? ? 8345 : 21_453 }
    )
  end
end
