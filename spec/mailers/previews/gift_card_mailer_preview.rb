# frozen_string_literal: true

# Preview all emails at http://localhost:3000/rails/mailers/gift_card_mailer
class GiftCardMailerPreview < ActionMailer::Preview
  include WickedPdf::WickedPdfHelper::Assets

  def gift_card_email
    GiftCardMailer.with(
      email: 'test@example.com',
      number_of_months: '3',
      gift_card_pdf: gift_card_pdf
    ).gift_card_email
  end

  private

  def gift_card_pdf
    WickedPdf.new.pdf_from_string(
      ApplicationController.render(
        template: 'gift_cards/gift_card',
        layout: false,
        assigns: {
          message: 'God jul!',
          number_of_months: 3
        }
      ),
      orientation: 'portrait'
    )
  end
end
