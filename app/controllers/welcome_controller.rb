class WelcomeController < ApplicationController

  def index
  end

  def plan
    @lifestyle_choice_co2 = LifestyleChoice.get_lifestyle_choice_co2
    gon.lifestyle_choice_co2 = @lifestyle_choice_co2
    gon.locale = I18n.locale
    gon.SEK_PER_TONNE = LifestyleChoice::SEK_PER_TONNE
    gon.BUFFER_SIZE = LifestyleChoice::BUFFER_SIZE
    gon.SEK_PER_DOLLAR = LifestyleChoice::SEK_PER_DOLLAR
    gon.price_info_popup_content = I18n.t('price_info_popup_content')
  end

  def about
  end

  def contact
  end

  def faq
  end

  def friendlyguide
  end

  def press
    @press_images = Dir.glob("app/assets/images/press/*.jpg")
    @press_social_images = Dir.glob("app/assets/images/press_social/*.jpg")
  end

end
