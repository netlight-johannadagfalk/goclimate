# frozen_string_literal: true

# Preview all emails at http://localhost:3000/rails/mailers/gift_card_mailer
class GiftCardMailerPreview < ActionMailer::Preview
  include WickedPdf::WickedPdfHelper::Assets

  def gift_card_email
    GiftCardMailer.with(
      email: 'test@example.com',
      number_of_months: '3',
      filename: 'giftcard.pdf',
      file: gift_card_pdf
    ).gift_card_email
  end

  private

  def gift_card_pdf
    WickedPdf.new.pdf_from_string(
      ApplicationController.render(
        template: 'gift_cards/download',
        layout: 'giftcard',
        assigns: {
          message: 'God jul!',
          number_of_months: 12
        }
      ),
      orientation: 'portrait'
    )
  end
end
