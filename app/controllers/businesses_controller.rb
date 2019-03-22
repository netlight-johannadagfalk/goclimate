# frozen_string_literal: true

class BusinessesController < ApplicationController
  def new
    gon.locale = I18n.locale
    gon.BUSINESS_SEK_PER_TONNE = LifestyleChoice::BUSINESS_SEK_PER_TONNE
    gon.SEK_PER_USD = LifestyleChoice::SEK_PER_USD
    gon.SEK_PER_EUR = LifestyleChoice::SEK_PER_EUR
  end

  def create
    @email = params[:email]
    BusinessInterestMailer.notice_email(@email, params[:number_of_employees], I18n.locale).deliver
  end
end
