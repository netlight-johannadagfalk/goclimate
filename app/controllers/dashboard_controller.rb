class DashboardController < ApplicationController

  before_action :authenticate_user!

  def index

    require 'uri'

    if StripeEvent.payments(current_user).count == 0
      StripeEvent.try_updating_events current_user
    end

    @total_usd = StripeEvent.total_in_usd
    @total_sek = StripeEvent.total_in_sek
    @total_carbon_offset = Project.total_carbon_offset

    my_amount_invested_usd_part = StripeEvent.payments(current_user).where(paid: true).where(currency: "usd").sum("stripe_amount").to_i / 100
    my_amount_invested_sek_part = StripeEvent.payments(current_user).where(paid: true).where(currency: "sek").sum("stripe_amount").to_i / 100
    @my_amount_invested_usd = (my_amount_invested_usd_part + my_amount_invested_sek_part / 8.7).round
    @my_amount_invested_sek = (my_amount_invested_sek_part + my_amount_invested_usd_part * 8.7).round    

    @my_neutral_months = StripeEvent.payments(current_user).where(paid: true).count
    @my_neutral_months = @my_neutral_months == 0 ? 1 : @my_neutral_months

    @unique_climate_neutral_users = User.distinct.pluck(:stripe_customer_id).count

    @total_climate_neutral_months = StripeEvent.where(stripe_object: "charge").where(paid: true).count

    @user_top_list = User.where("users.stripe_customer_id != ''").left_joins(:stripe_events).where("stripe_events.paid = true").select("users.id, COUNT(1)").group("users.id").order('COUNT(1) DESC')

    @country_top_list = User.where("users.stripe_customer_id != ''").left_joins(:stripe_events).where("stripe_events.paid = true").select("users.country, COUNT(1)").group("users.country").order('COUNT(1) DESC')

    @projects = Project.all.order(created_at: :desc).limit(5);

    if @my_neutral_months == 1
      @social_quote = I18n.t('I_have_lived_climate_neutral_for_one_month_join_me', months: @my_neutral_months)
    else
      @social_quote = I18n.t('I_have_lived_climate_neutral_for_more_months_join_me', months: @my_neutral_months)
    end
    @encoded_social_quote = URI.encode(@social_quote + ' -> ' + I18n.t('goclimateneutral_url'))

    @should_show_share_popup = current_user.last_seen_at < 24.hour.ago

  end
end