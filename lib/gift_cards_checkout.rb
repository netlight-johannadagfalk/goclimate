# frozen_string_literal: true

class GiftCardsCheckout
  STRIPE_DESCRIPTION_BASE = 'Gift Card'

  attr_reader :stripe_token, :gift_card

  def initialize(stripe_token, gift_card)
    @stripe_token = stripe_token
    @gift_card = gift_card
  end

  def checkout
    Stripe::Charge.create(
      source: @stripe_token,
      amount: @gift_card.price,
      currency: @gift_card.currency,
      description: "#{STRIPE_DESCRIPTION_BASE} #{@gift_card.number_of_months} months"
    )
  end
end
