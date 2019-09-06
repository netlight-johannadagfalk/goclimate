# frozen_string_literal: true

class UsersController < ApplicationController
  def show
    @user = User.find(params[:id])
    @neutral_months = StripeEvent.payments(@user).where(paid: true).count
    @neutral_months = 1 if @neutral_months == 0

    @sharing = params[:share].present?

    render
  end
end
