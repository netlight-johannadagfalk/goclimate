# frozen_string_literal: true

class GiftCardsController < ApplicationController
  def index
    @gift_card_1_months = GiftCard.new(number_of_months: 1, currency: currency)
    @gift_card_3_months = GiftCard.new(number_of_months: 3, currency: currency)
    @gift_card_6_months = GiftCard.new(number_of_months: 6, currency: currency)
    @gift_card_12_months = GiftCard.new(number_of_months: 12, currency: currency)
  end

  def new
    @gift_card = new_gift_card_from_params
    @payment_intent = @gift_card.create_payment_intent
  end

  def create
    @gift_card = gift_card_from_form_fields
    @checkout = GiftCardsCheckout.new(params[:paymentIntentId], @gift_card, params[:email])

    # As we've already charged the customer in the browser and we expect this
    # to always be valid, better to fail early so we detect any edge cases
    # rather than silently showing validation errors.
    @checkout.finalize_checkout!
    @gift_card.save!

    redirect_to(
      thank_you_gift_cards_path,
      flash: {
        number_of_months: @gift_card.number_of_months,
        email: params[:email],
        certificate_key: @gift_card.key
      }
    )
  end

  def thank_you
    @number_of_months = flash[:number_of_months].to_i
    @email = flash[:email]
    @certificate_key = flash[:certificate_key]

    @gift_card = GiftCard.find_by_key!(@certificate_key)

    redirect_to gift_cards_path if @number_of_months.nil?
  end

  private

  def new_gift_card_from_params
    GiftCard.new(
      number_of_months: params[:subscription_months_to_gift].to_i,
      currency: currency
    )
  end

  def gift_card_from_form_fields
    new_gift_card_from_params.tap do |gift_card|
      gift_card.attributes = params.require(:gift_card).permit(:message)
    end
  end

  def currency
    Currency.from_locale(I18n.locale)
  end
end
