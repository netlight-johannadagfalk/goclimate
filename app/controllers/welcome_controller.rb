# frozen_string_literal: true

class WelcomeController < ApplicationController
  def index
    @unique_climate_neutral_users = User.with_active_subscription.count
    @total_carbon_offset = Project.total_carbon_offset
    @lifestyle_choice_co2 = LifestyleChoice.lifestyle_choice_co2
    gon.lifestyle_choice_co2 = @lifestyle_choice_co2
    gon.locale = I18n.locale
    gon.SEK_PER_TONNE = LifestyleChoice::SEK_PER_TONNE
    gon.BUFFER_SIZE = LifestyleChoice::BUFFER_SIZE
    gon.SEK_PER_USD = LifestyleChoice::SEK_PER_USD
    gon.SEK_PER_EUR = LifestyleChoice::SEK_PER_EUR
    gon.price_info_popup_content = I18n.t('price_info_popup_content')
  end

  def about
  end

  def companies
  end

  def contact
  end

  def faq
  end

  def press
    @press_images = Dir.glob('app/assets/images/press/*.*')
    @press_social_images = Dir.glob('app/assets/images/press_social/*.*')
  end

  def our_projects
    @projects = Project.all.order(date_bought: :desc)
  end

  def transparency
    @projects = Project.all.order(date_bought: :desc)
    @unique_climate_neutral_users = User.with_active_subscription.count
    @total_carbon_offset = Project.total_carbon_offset

    # as of 190131 - found in https://docs.google.com/spreadsheets/d/1RzUCaVqTTxJYjfUMeh3KlTxBpiATy2ViPO3m0LHGpG8/edit#gid=0
    @project_cost_in_sek_2019 = -350_250
    @other_operating_expenses_2019 = -28_258

    # as of 190131 - found at fortnox.se
    @invoiced_2019 = 170_196

    @payouts_from_users_2019 = (StripePayout.where('extract(year from created_at) = 2019').sum(:amount) / 100)
    @results_2019 = @payouts_from_users_2019 + @invoiced_2019 + (@project_cost_in_sek_2019 + @other_operating_expenses_2019)
  end

  def privacy_policy
  end
end
