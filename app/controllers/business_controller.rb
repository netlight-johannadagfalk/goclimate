# frozen_string_literal: true

class BusinessController < ApplicationController
  def index
    gon.locale = I18n.locale
    gon.BUSINESS_SEK_PER_TONNE = LifestyleChoice::BUSINESS_SEK_PER_TONNE
    gon.SEK_PER_USD = LifestyleChoice::SEK_PER_USD
    gon.SEK_PER_EUR = LifestyleChoice::SEK_PER_EUR
  end

  def thank_you
    @email = params[:email]
    BusinessIntrestNoticeMailer.send_email(@email, params[:number_of_employees], I18n.locale).deliver
  end
end
