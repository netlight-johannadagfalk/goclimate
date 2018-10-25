# frozen_string_literal: true

require 'gift_cards_checkout'

class GiftCardsController < ApplicationController
  def index
  end

  def new
    @subscription_months_to_gift = params[:subscription_months_to_gift]
  end

  def create
    @gift_card = SubscriptionMonthsGiftCard.new(
      params[:subscription_months_to_gift].to_i, 'sek'
    )

    GiftCardsCheckout.new(params[:stripeToken], @gift_card).checkout
  end
end
