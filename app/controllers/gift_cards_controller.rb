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
    @gift_card = SubscriptionMonthsGiftCard.new(
      params[:subscription_months_to_gift].to_i, 'sek'
    )

    GiftCardsCheckout.new(params[:stripeToken], @gift_card).checkout
  end
end
