class UsersController < ApplicationController
  def show
    @user = User.find(params[:id])
    @neutral_months = StripeEvent.payments(@user).where(paid: true).count
    @neutral_months = 1 if @neutral_months == 0

    if @user.user_name.nil?
      if @neutral_months == 1
        @social_quote = I18n.t('i_have_lived_climate_neutral_for_one_month_join_me', months: @neutral_months)
      else
        @social_quote = I18n.t('i_have_lived_climate_neutral_for_more_months_join_me', months: @neutral_months)
      end
    else
      if @neutral_months == 1
        @social_quote = I18n.t('name_have_lived_climate_neutral_for_one_month_join_me', months: @neutral_months, name: @user.user_name)
      else
        @social_quote = I18n.t('name_have_lived_climate_neutral_for_more_months_join_me', months: @neutral_months, name: @user.user_name)
      end
    end

    if params[:share].nil?
      @sharing = false
    else
      @sharing = true
    end

    @encoded_social_quote = CGI.escape(@social_quote + ' -> ' + I18n.t('goclimateneutral_url'))

    render layout: "user"
  end
end
