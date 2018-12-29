# frozen_string_literal: true

require 'gift_card_certificate_pdf_generator'

# Preview all emails at http://localhost:3000/rails/mailers/gift_card_mailer
class GiftCardMailerPreview < ActionMailer::Preview
  def gift_card_email
    pdf = GiftCardCertificatePDFGenerator.new(message: 'God jul!', number_of_months: 3).generate_pdf

    GiftCardMailer.with(
      email: 'test@example.com',
      number_of_months: '3',
      gift_card_pdf: pdf
    ).gift_card_email
  end
end
