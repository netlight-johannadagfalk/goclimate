# frozen_string_literal: true

class BusinessesController < ApplicationController
  def new
    @cost_per_tonne = cost_per_tonne
  end

  def create
    @email = params[:email]
    BusinessInterestMailer.notice_email(@email, params[:number_of_employees], I18n.locale).deliver
  end

  private

  def cost_per_tonne
    case I18n.locale
    when :sv
      LifestyleChoice::BUSINESS_SEK_PER_TONNE
    when :en
      LifestyleChoice::BUSINESS_SEK_PER_TONNE / LifestyleChoice::SEK_PER_USD
    when :de
      LifestyleChoice::BUSINESS_SEK_PER_TONNE / LifestyleChoice::SEK_PER_EUR
    end
  end
end
