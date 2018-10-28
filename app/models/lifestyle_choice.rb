# frozen_string_literal: true

class LifestyleChoice < ApplicationRecord
  has_and_belongs_to_many :users

  SEK_PER_TONNE = 40
  BUFFER_SIZE = 2
  SEK_PER_USD = 8.5
  SEK_PER_EUR = 10

  def self.get_lifestyle_choice_price(choices)
    if choices == []
      return 'x'
    end

    tonne_co2 = lifestyle_choice_tonnes choices

    if I18n.locale == :en
      price = tonne_co2 * SEK_PER_TONNE / SEK_PER_USD / 12
      rounded_price_with_buffer = (price * BUFFER_SIZE).round(1)
    elsif I18n.locale == :de
      price = tonne_co2 * SEK_PER_TONNE / SEK_PER_EUR / 12
      rounded_price_with_buffer = (price * BUFFER_SIZE).round(1)
    else
      price = tonne_co2 * SEK_PER_TONNE / 12
      rounded_price_with_buffer = (price * BUFFER_SIZE / 5).ceil * 5
    end

    rounded_price_with_buffer
  end

  def self.lifestyle_choice_tonnes(choices)
    tonne_co2 = 0
    people = 1
    choices.each do |choice|
      lifestyle_choice = LifestyleChoice.find choice

      if lifestyle_choice.category == 'people'
        people = lifestyle_choice.co2.to_i
      else
        tonne_co2 += lifestyle_choice.co2
      end
    end
    tonne_co2 *= people
    tonne_co2
  end

  def self.lifestyle_choice_co2
    lifestyle_choice_co2 = []
    LifestyleChoice.all.each do |choice|
      lifestyle_choice_co2[choice.id] = choice.co2
    end
    lifestyle_choice_co2
  end

  def self.stripe_plan(choices)
    choices = choices.split(',').map(&:to_i)
    get_lifestyle_choice_price choices
  end
end
