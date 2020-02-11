# frozen_string_literal: true

class GiftCardsController < ApplicationController
  before_action :validate_months_parameter, only: [:new]

  def index
    @gift_card_1_months = GiftCard.new(number_of_months: 1, currency: current_region.currency)
    @gift_card_3_months = GiftCard.new(number_of_months: 3, currency: current_region.currency)
    @gift_card_6_months = GiftCard.new(number_of_months: 6, currency: current_region.currency)
    @gift_card_12_months = GiftCard.new(number_of_months: 12, currency: current_region.currency)
  end

  def new
    @gift_card = new_gift_card_from_params
    @payment_intent = @gift_card.create_payment_intent
  end

  def create
    @gift_card = gift_card_from_form_fields
    @payment_intent = Stripe::PaymentIntent.retrieve(@gift_card.payment_intent_id)

    render(:new) && return unless @payment_intent.status == 'succeeded'

    # As we've already charged the customer in the browser and we expect this
    # to always be valid, better to fail early so we detect any edge cases
    # rather than silently showing validation errors.
    @gift_card.paid_at = Time.now
    @gift_card.save!
    @gift_card.send_confirmation_email

    redirect_to thank_you_gift_card_path(@gift_card)
  end

  def thank_you
    @gift_card = GiftCard.find_by_key!(params[:key])
  end

  protected

  def canonical_query_params
    super + [:subscription_months_to_gift]
  end

  private

  def validate_months_parameter
    redirect_to gift_cards_path unless [1, 3, 6, 12].include?(params[:subscription_months_to_gift].to_i)
  end

  def new_gift_card_from_params
    GiftCard.new(
      number_of_months: params[:subscription_months_to_gift].to_i,
      currency: current_region.currency
    )
  end

  def gift_card_from_form_fields
    attributes = params.require(:gift_card).permit(
      :number_of_months, :customer_email, :message, :payment_intent_id
    ).to_h.symbolize_keys

    GiftCard.new(currency: current_region.currency, **attributes)
  end
end
