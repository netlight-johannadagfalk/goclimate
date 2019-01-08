# frozen_string_literal: true

class SubscriptionMailer < ApplicationMailer
  before_action { @user = User.find_by_email(params[:email]) }
  before_action { I18n.locale = @user.language }

  default to: -> { @user.email },
          asm: { group_id: SENDGRID_ASM_GROUP_IDS[:subscription] }

  helper :subscription_mailer

  def one_more_month_email
    @climate_neutral_months = StripeEvent.payments(@user).where(paid: true).count
    @total_carbon_offset = Project.total_carbon_offset

    mail subject: I18n.t('thank_you')
  end

  def one_more_year_email
    @climate_neutral_years = StripeEvent.payments(@user).where(paid: true).count / 12
    @total_carbon_offset = Project.total_carbon_offset

    mail subject: I18n.t('thank_you')
  end

  def payment_failed_email
    mail subject: I18n.t('the_payment_unfortunately_failed')
  end
end
