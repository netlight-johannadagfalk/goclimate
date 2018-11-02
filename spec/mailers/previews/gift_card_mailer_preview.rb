# Preview all emails at http://localhost:3000/rails/mailers/gift_card_mailer
class GiftCardMailerPreview < ActionMailer::Preview

  def gift_card_email
    GiftCardMailer.with(email: "test@example.com", number_of_months: "3", filename: "giftcard.pdf").gift_card_email
  end
end
