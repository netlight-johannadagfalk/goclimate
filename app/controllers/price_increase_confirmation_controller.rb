# frozen_string_literal: true

class PriceIncreaseConfirmationController < ApplicationController
  before_action :authenticate_user!

  def new
  end

  def create
    @should_update_card = current_user.three_months_since_last_card_charge?

    confirmation = PriceIncreaseConfirmation.where(user_id: current_user.id).first_or_create
    confirmation.assign_attributes(confirmation_params)
    if confirmation.save
      redirect_to thank_you_price_increase_confirmation_path
    else
      redirect_to(
        new_price_increase_confirmation_path,
        notice: 'There was and error and the data could not be saved! Please try again or contact us at hello@goclimate.com' # rubocop:disable Metrics/LineLength
      )
    end
  end

  def thank_you
    @accepted = PriceIncreaseConfirmation.where(user_id: current_user.id).first.accepted
  end

  def opt_in
    save_price_increase_confirmation(true)
  end

  def opt_out
    save_price_increase_confirmation(false)
  end

  private

  def save_price_increase_confirmation(confirmation)
    current_user.price_increase_confirmation = confirmation
    current_user.save
  end

  def confirmation_params
    params.permit(:accepted)
  end
end
