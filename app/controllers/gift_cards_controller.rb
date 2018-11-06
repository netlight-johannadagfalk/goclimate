# frozen_string_literal: true

require 'gift_cards_checkout'

class GiftCardsController < ApplicationController
  def index
    @gift_card_3_months = SubscriptionMonthsGiftCard.new(3, currency)
    @gift_card_6_months = SubscriptionMonthsGiftCard.new(6, currency)
    @gift_card_12_months = SubscriptionMonthsGiftCard.new(12, currency)
  end

  def new
    @gift_card = SubscriptionMonthsGiftCard.new(
      params[:subscription_months_to_gift].to_i, currency
    )
    @currency = currency
  end

  def create
    @number_of_months = params[:subscription_months_to_gift]
    @email = params[:stripeEmail]
    @currency = currency

    @gift_card = SubscriptionMonthsGiftCard.new(
      params[:subscription_months_to_gift].to_i, currency
    )

    stripe_charge = GiftCardsCheckout.new(params[:stripeToken], @gift_card).checkout
    @filename = 'Your_gift_card_' + stripe_charge['id'] + '.pdf'

    GiftCardMailer.with(email: @email, number_of_months: @number_of_months, filename: @filename).gift_card_email.deliver_now
  end

  def currency
    if I18n.locale == :en
      'usd'
    elsif I18n.locale == :sv
      'sek'
    else
      'eur'
    end
  end
end
