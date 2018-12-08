# frozen_string_literal: true

require 'gift_cards_checkout'

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
    @message = t('views.gift_cards.example.message_html')
    @number_of_months = params[:subscription_months_to_gift].to_i
    @number_of_months = 6 if @number_of_months == 0
    @example = true

    render_gift_card(true)
  end

  # This is to download the actual gift card PDF
  def download
    @message = session[:message]
    @number_of_months = session[:number_of_months].to_i

    render_gift_card(false)
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

    pdf = WickedPdf.new.pdf_from_string(
      ApplicationController.render(
        template: 'gift_cards/gift_card',
        layout: false,
        assigns: {
          message: @message,
          number_of_months: @number_of_months
        }
      ),
      orientation: 'portrait'
    )

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

  # Render the current gift card using pdf or html depending on requested format.
  # If inline_pdf is true, PDFs will be shown in the page. Otherwise they will be downloaded as attachment.
  def render_gift_card(inline_pdf)
    disposition = inline_pdf ? 'inline' : 'attachment'

    respond_to do |format|
      # The html version is intended for preview and testing purposes.
      format.html do
        render template: 'gift_cards/gift_card', layout: false
      end
      # The "real" gift card is a PDF, below.
      # See https://github.com/mileszs/wicked_pdf for a description of the params.
      format.pdf do
        render  pdf: 'GoClimateNeutral-GiftCard', # Filename, excluding .pdf extension.
                orientation: 'portrait',
                template: 'gift_cards/gift_card',
                disposition: disposition
      end
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
