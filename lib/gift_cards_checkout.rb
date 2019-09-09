# frozen_string_literal: true

class GiftCardsCheckout
  STRIPE_DESCRIPTION_BASE = 'Gift Card'

  attr_reader :stripe_token, :gift_card, :confirmation_email_recipient, :errors

  def initialize(stripe_token, gift_card, confirmation_email_recipient)
    @stripe_token = stripe_token
    @gift_card = gift_card
    @confirmation_email_recipient = confirmation_email_recipient
    @errors = {}
  end

  def checkout
    charge
    send_confirmation_email
    true
  rescue Stripe::CardError => error
    errors[error.code.to_sym] = error.message
    false
  end

  private

  def charge
    Stripe::Charge.create(
      source: @stripe_token,
      amount: @gift_card.price * 100,
      currency: @gift_card.currency,
      description: "#{STRIPE_DESCRIPTION_BASE} #{@gift_card.number_of_months} months"
    )
  end

  def send_confirmation_email
    pdf = GiftCardCertificatePdfGenerator.from_gift_card(@gift_card).generate_pdf

    GiftCardMailer.with(
      email: @confirmation_email_recipient,
      number_of_months: @gift_card.number_of_months,
      gift_card_pdf: pdf
    ).gift_card_email.deliver_now
  end
end
