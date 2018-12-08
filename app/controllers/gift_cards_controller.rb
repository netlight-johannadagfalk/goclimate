# frozen_string_literal: true

require 'gift_cards_checkout'
require 'gift_card_certificate_pdf_generator'

class GiftCardsController < ApplicationController
  def index
    @gift_card_1_months = SubscriptionMonthsGiftCard.new(1, currency)
    @gift_card_3_months = SubscriptionMonthsGiftCard.new(3, currency)
    @gift_card_6_months = SubscriptionMonthsGiftCard.new(6, currency)
    @gift_card_12_months = SubscriptionMonthsGiftCard.new(12, currency)
  end

  # This is a preview version of the gift card. Includes sample text and a big EXAMPLE stamp.
  # Optionally, you can include a subscription_months_to_gift query param.
  def example
    number_of_months = params[:subscription_months_to_gift].present? ? params[:subscription_months_to_gift] : 6

    pdf = GiftCardCertificatePDFGenerator.new(
      message: t('views.gift_cards.example.message_html'),
      number_of_months: number_of_months,
      example: true
    ).generate_pdf

    send_data pdf, filename: 'GoClimateNeutral Gift Card.pdf', type: :pdf, disposition: :inline
  end

  # This is to download the actual gift card PDF
  def download
    pdf = GiftCardCertificatePDFGenerator.new(
      message: session[:message],
      number_of_months: session[:number_of_months].to_i
    ).generate_pdf

    send_data pdf, filename: 'GoClimateNeutral Gift Card.pdf', type: :pdf
  end

  def new
    @gift_card = SubscriptionMonthsGiftCard.new(
      params[:subscription_months_to_gift].to_i, currency
    )
    @currency = currency
  end

  def create
    @number_of_months = params[:subscription_months_to_gift].to_i
    @email = params[:stripeEmail]
    @message = params[:message]

    # storing message in session variable because
    # it is used in download.pdf later, and I don't know how to pass params to that.
    # I'm sure there's a better way...
    session[:message] = @message
    session[:number_of_months] = @number_of_months

    @currency = currency

    @gift_card = SubscriptionMonthsGiftCard.new(
      params[:subscription_months_to_gift].to_i, currency
    )

    begin
      GiftCardsCheckout.new(params[:stripeToken], @gift_card).checkout
    rescue Stripe::CardError => e
      body = e.json_body
      err  = body[:error]
      flash[:error] = 'Something went wrong with the payment'
      flash[:error] = "The payment unfortunately failed: #{err[:message]}." if err[:message]
      redirect_to new_gift_card_path(subscription_months_to_gift: @number_of_months)
      return
    end

    pdf = GiftCardCertificatePDFGenerator.new(
      message: @message,
      number_of_months: @number_of_months
    ).generate_pdf

    GiftCardMailer.with(
      email: @email,
      number_of_months: @number_of_months,
      gift_card_pdf: pdf
    ).gift_card_email.deliver_now

    redirect_to thank_you_gift_cards_path, flash: { number_of_months: @number_of_months, email: @email }
  end

  def thank_you
    @number_of_months = flash[:number_of_months].to_i
    @email = flash[:email]

    redirect_to gift_cards_path if @number_of_months.nil?
  end

  private

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
