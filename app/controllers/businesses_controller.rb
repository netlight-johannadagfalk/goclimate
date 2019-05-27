# frozen_string_literal: true

class BusinessesController < ApplicationController
  def new
    @cost_per_tonne = cost_per_tonne
  end

  def create
    @email = params[:email]
    BusinessMailer.employee_offset_notice_email(@email, params[:number_of_employees], I18n.locale).deliver
  end
end
