# frozen_string_literal: true

class SubscriptionMailer < ApplicationMailer
  def one_more_month_email
    user = User.find_by_email(params[:email])
    I18n.locale = user.language

    @climate_neutral_months = StripeEvent.payments(user).where(paid: true).count
    @total_carbon_offset = Project.total_carbon_offset

    share_url = I18n.t('goclimateneutral_url') + 'users/' + user.id.to_s
    @facebook_share_url = share_url + '?share=fb'
    @twitter_share_url = share_url + '?share=tw'

    @months =
      if @climate_neutral_months == 1
        I18n.t('month')
      else
        I18n.t('months')
      end

    mail(
      to: user.email,
      subject: I18n.t('thank_you'),
      asm: { group_id: 16_739 }
    )
  end

  def one_more_year_email
    user = User.find_by_email(params[:email])
    I18n.locale = user.language

    @climate_neutral_years = StripeEvent.payments(user).where(paid: true).count / 12
    @total_carbon_offset = Project.total_carbon_offset

    share_url = I18n.t('goclimateneutral_url') + 'users/' + user.id.to_s
    @facebook_share_url = share_url + '?share=fb'
    @twitter_share_url = share_url + '?share=tw'

    @years =
      if @climate_neutral_years == 1
        I18n.t('year')
      else
        I18n.t('years')
      end

    mail(
      to: user.email,
      subject: I18n.t('thank_you'),
      asm: { group_id: 16_739 }
    )
  end

  def payment_failed_email
    user = User.find_by_email(params[:email])
    I18n.locale = user.language

    mail(
      to: user.email,
      subject: I18n.t('the_payment_unfortunately_failed'),
      asm: { group_id: 16_739 }
    )
  end
end
