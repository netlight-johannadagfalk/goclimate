# frozen_string_literal: true

require 'gift_cards_checkout'

class GiftCardsController < ApplicationController
  def index
    @gift_card_3_months = SubscriptionMonthsGiftCard.new(3, 'sek')
    @gift_card_6_months = SubscriptionMonthsGiftCard.new(6, 'sek')
    @gift_card_12_months = SubscriptionMonthsGiftCard.new(12, 'sek')
  end

  def new
    @gift_card = SubscriptionMonthsGiftCard.new(
      params[:subscription_months_to_gift].to_i, 'sek'
    )
  end

  def create
    @number_of_months = params[:subscription_months_to_gift]
    @email = params[:stripeEmail]

    @gift_card = SubscriptionMonthsGiftCard.new(
      params[:subscription_months_to_gift].to_i, 'sek'
    )

    stripe_charge = GiftCardsCheckout.new(params[:stripeToken], @gift_card).checkout
    @filename = 'Your_gift_card_' + stripe_charge['id'] + '.pdf'

    GiftCardMailer.with(email: @email, number_of_months: @number_of_months, filename: @filename).gift_card_email.deliver_now
  end
end
