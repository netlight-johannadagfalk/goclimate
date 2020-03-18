# frozen_string_literal: true

class LifestyleChoice < ApplicationRecord
  has_and_belongs_to_many :users

  SEK_PER_TONNE = 40
  BUSINESS_SEK_PER_TONNE = 55
  BUFFER_SIZE = 2

  def self.lifestyle_choice_footprint(choices)
    tonne_co2 = 0
    people = 1
    choices.each do |choice|
      lifestyle_choice = LifestyleChoice.find(choice)

      if lifestyle_choice.category == 'people'
        people = lifestyle_choice.co2.to_i
      else
        tonne_co2 += lifestyle_choice.co2
      end
    end

    GreenhouseGases.new((tonne_co2 * people * 1000).to_i)
  end

  def self.lifestyle_choice_co2
    lifestyle_choice_co2 = []
    LifestyleChoice.all.each do |choice|
      lifestyle_choice_co2[choice.id] = choice.co2
    end
    lifestyle_choice_co2
  end
end
