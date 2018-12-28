# frozen_string_literal: true

class UsersController < ApplicationController
  def show
    @user = User.find(params[:id])
    @neutral_months = StripeEvent.payments(@user).where(paid: true).count
    @neutral_months = 1 if @neutral_months == 0

    # TODO: This is view logic and should be in a helper
    @social_quote =
      if @user.user_name.nil?
        I18n.t('i_have_lived_climate_neutral_for_join_me', count: @neutral_months)
      else
        I18n.t(
          'name_have_lived_climate_neutral_for_join_me', count: @neutral_months, name: @user.user_name
        )
      end

    @sharing = params[:share].present?

    # TODO: This is view logic and should be in a helper
    @encoded_social_quote = CGI.escape(@social_quote + ' -> ' + I18n.t('goclimateneutral_url'))

    render layout: 'user'
  end
end
