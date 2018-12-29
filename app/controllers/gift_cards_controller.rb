# frozen_string_literal: true

require 'gift_cards_checkout'
require 'gift_card_certificate_pdf_generator'

class GiftCardsController < ApplicationController
  def index
    @gift_card_1_months = GiftCard.new(number_of_months: 1, currency: currency)
    @gift_card_3_months = GiftCard.new(number_of_months: 3, currency: currency)
    @gift_card_6_months = GiftCard.new(number_of_months: 6, currency: currency)
    @gift_card_12_months = GiftCard.new(number_of_months: 12, currency: currency)
  end

  def new
    @gift_card = new_gift_card_from_params
    @currency = currency
  end

  def create
    @gift_card = gift_card_from_params
    @currency = currency

    email = params[:stripeEmail]

    # As we're halfway through a payment process and we expect this to always
    # be valid, better to fail early so we detect any edge cases rather than
    # silently showing validation errors.
    @gift_card.save!

    begin
      GiftCardsCheckout.new(params[:stripeToken], @gift_card, email).checkout
    rescue Stripe::CardError => e
      body = e.json_body
      err  = body[:error]
      flash[:error] = 'Something went wrong with the payment'
      flash[:error] = "The payment unfortunately failed: #{err[:message]}." if err[:message]
      redirect_to new_gift_card_path(subscription_months_to_gift: params[:subscription_months_to_gift])
      return
    end

    redirect_to(
      thank_you_gift_cards_path,
      flash: {
        number_of_months: @gift_card.number_of_months,
        email: email,
        certificate_key: @gift_card.key
      }
    )
  end

  def thank_you
    @number_of_months = flash[:number_of_months].to_i
    @email = flash[:email]
    @certificate_key = flash[:certificate_key]

    redirect_to gift_cards_path if @number_of_months.nil?
  end

  private

  def new_gift_card_from_params
    GiftCard.new.tap do |gift_card|
      gift_card.number_of_months = params[:subscription_months_to_gift].to_i
      gift_card.currency = currency
    end
  end

  def gift_card_from_params
    GiftCard.new(params.require(:gift_card).permit(:message)).tap do |gift_card|
      gift_card.number_of_months = params[:subscription_months_to_gift].to_i
      gift_card.currency = currency
    end
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
