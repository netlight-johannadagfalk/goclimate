# frozen_string_literal: true

class LifestyleChoice < ApplicationRecord
  has_and_belongs_to_many :users

  SEK_PER_TONNE = 40
  BUSINESS_SEK_PER_TONNE = 55
  BUFFER_SIZE = 2
  SEK_PER_USD = 8.5
  SEK_PER_EUR = 10

  def self.get_lifestyle_choice_price(choices, currency)
    return 'x' if choices == []

    tonne_co2 = lifestyle_choice_tonnes(choices)
    rounded_price_with_buffer(tonne_co2, currency)
  end

  def self.lifestyle_choice_tonnes(choices)
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
    tonne_co2 * people
  end

  def self.lifestyle_choice_co2
    lifestyle_choice_co2 = []
    LifestyleChoice.all.each do |choice|
      lifestyle_choice_co2[choice.id] = choice.co2
    end
    lifestyle_choice_co2
  end

  def self.stripe_plan(choices, currency = nil)
    choices = choices.split(',').map(&:to_i)
    get_lifestyle_choice_price(choices, currency)
  end

  private_class_method def self.rounded_price_with_buffer(tonne_co2, currency)
    price_in_sek = BigDecimal(tonne_co2) * SEK_PER_TONNE / 12 * BUFFER_SIZE
    case currency
    when Currency::USD
      Money.from_amount((price_in_sek / SEK_PER_USD).round(1), Currency::USD)
    when Currency::EUR
      Money.from_amount((price_in_sek / SEK_PER_EUR).round(1), Currency::EUR)
    else
      Money.from_amount((price_in_sek / 5).ceil * 5, Currency::SEK)
    end
  end
end
