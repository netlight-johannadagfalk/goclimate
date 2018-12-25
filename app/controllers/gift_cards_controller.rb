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
    number_of_months = (params[:subscription_months_to_gift].presence || 6).to_i

    pdf = GiftCardCertificatePDFGenerator.new(
      message: t('views.gift_cards.example.message_html'),
      number_of_months: number_of_months,
      example: true
    ).generate_pdf

    send_data pdf, filename: 'GoClimateNeutral Gift Card.pdf', type: :pdf, disposition: :inline
  end

  # This is to download the actual gift card PDF
  def download
    certificate =
      if (certificate_key = params[:key])
        GiftCard.find_by_key(certificate_key)
      else
        # TODO: Remove this once deployed and sessions have been given time to become irrelevant
        GiftCard.new(message: session[:message], number_of_months: session[:number_of_months].to_i)
      end

    pdf = GiftCardCertificatePDFGenerator.from_certificate(certificate).generate_pdf

    send_data pdf, filename: 'GoClimateNeutral Gift Card.pdf', type: :pdf
  end

  def new
    @gift_card = gift_card_from_params
    @gift_card_certificate = GiftCard.new
    @currency = currency
  end

  def create
    @gift_card = gift_card_from_params
    @gift_card_certificate = gift_card_certificate_from_params
    @currency = currency

    email = params[:stripeEmail]

    # As we're halfway through a payment process and we expect this to always
    # be valid, better to fail early so we detect any edge cases rather than
    # silently showing validation errors.
    @gift_card_certificate.save!

    begin
      GiftCardsCheckout.new(params[:stripeToken], @gift_card).checkout
    rescue Stripe::CardError => e
      body = e.json_body
      err  = body[:error]
      flash[:error] = 'Something went wrong with the payment'
      flash[:error] = "The payment unfortunately failed: #{err[:message]}." if err[:message]
      redirect_to new_gift_card_path(subscription_months_to_gift: params[:subscription_months_to_gift])
      return
    end

    pdf = GiftCardCertificatePDFGenerator.from_certificate(@gift_card_certificate).generate_pdf

    GiftCardMailer.with(
      email: email,
      number_of_months: @gift_card.number_of_months,
      gift_card_pdf: pdf
    ).gift_card_email.deliver_now

    redirect_to(
      thank_you_gift_cards_path,
      flash: {
        number_of_months: @gift_card.number_of_months,
        email: email,
        certificate_key: @gift_card_certificate.key
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

  def gift_card_from_params
    SubscriptionMonthsGiftCard.new(
      params[:subscription_months_to_gift].to_i, currency
    )
  end

  def gift_card_certificate_from_params
    gift_card_certificate = GiftCard.new(params.require(:gift_card_certificate).permit(:message))
    gift_card_certificate.number_of_months = params[:subscription_months_to_gift].to_i
    gift_card_certificate
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
