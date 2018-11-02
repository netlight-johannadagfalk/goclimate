class GiftCardMailer < ApplicationMailer
  def gift_card_email

    email = params[:email]
    @number_of_months = params[:number_of_months]
    filename = params[:filename]
    
    attachments[filename] = File.read(@number_of_months + '_months_sv.pdf')
    mail(to: email, 
      subject: 'Your gift card',
      asm: { group_id: 16_739 }
    )
  end
end
