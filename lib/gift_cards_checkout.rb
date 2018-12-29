# frozen_string_literal: true

class GiftCardsCheckout
  STRIPE_DESCRIPTION_BASE = 'Gift Card'

  attr_reader :stripe_token, :gift_card, :confirmation_email_recipient

  def initialize(stripe_token, gift_card, confirmation_email_recipient)
    @stripe_token = stripe_token
    @gift_card = gift_card
    @confirmation_email_recipient = confirmation_email_recipient
  end

  def checkout
    Stripe::Charge.create(
      source: @stripe_token,
      amount: @gift_card.price * 100,
      currency: @gift_card.currency,
      description: "#{STRIPE_DESCRIPTION_BASE} #{@gift_card.number_of_months} months"
    )

    pdf = GiftCardCertificatePDFGenerator.from_gift_card(@gift_card).generate_pdf

    GiftCardMailer.with(
      email: @confirmation_email_recipient,
      number_of_months: @gift_card.number_of_months,
      gift_card_pdf: pdf
    ).gift_card_email.deliver_now
  end
end
