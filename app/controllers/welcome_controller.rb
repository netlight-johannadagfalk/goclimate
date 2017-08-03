class WelcomeController < ApplicationController

  def index
  end

  def plan
    @lifestyle_choice_prices = LifestyleChoice.get_lifestyle_choice_prices
    gon.lifestyle_choice_prices = @lifestyle_choice_prices
  end

  def about
  end

  def contact
  end

  def faq
  end
end
