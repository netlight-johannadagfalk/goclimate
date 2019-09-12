# frozen_string_literal: true

class GiftCardsCheckout
  class ValidationError < StandardError; end

  STRIPE_DESCRIPTION_BASE = 'Gift Card'

  attr_reader :payment_intent, :gift_card, :confirmation_email_recipient, :errors

  def initialize(payment_intent_id, gift_card, confirmation_email_recipient)
    @payment_intent = Stripe::PaymentIntent.retrieve(payment_intent_id)
    @gift_card = gift_card
    @confirmation_email_recipient = confirmation_email_recipient
    @errors = {}
  end

  def finalize_checkout!
    raise ValidationError, 'Attempt to finalize checkout after payment was made was unsuccessful' unless valid?

    send_confirmation_email
    true
  end

  private

  def valid?
    errors[:email_invalid] = 'Email is not valid.' unless confirmation_email_recipient.match?(/\A\S+@.+\.\S+\z/)
    errors[:payment_failed] = 'Payment failed. Please try again.' unless payment_intent.status == 'succeeded'

    errors.empty?
  end

  def send_confirmation_email
    pdf = GiftCardCertificatePdf.from_gift_card(@gift_card).render

    GiftCardMailer.with(
      email: @confirmation_email_recipient,
      number_of_months: @gift_card.number_of_months,
      gift_card_pdf: pdf
    ).gift_card_email.deliver_now
  end
end
