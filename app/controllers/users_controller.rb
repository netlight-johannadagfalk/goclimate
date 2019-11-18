# frozen_string_literal: true

class UsersController < ApplicationController
  rescue_from ActiveRecord::RecordNotFound, with: :handle_record_not_found

  def show
    @user = User.find(params[:id])
    @neutral_months = CardCharge.payments(@user).where(paid: true).count
    @neutral_months = 1 if @neutral_months == 0

    @sharing = params[:share].present?

    render
  end
end
