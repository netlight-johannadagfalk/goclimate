class LifestyleChoice < ApplicationRecord
  has_and_belongs_to_many :users

  def self.get_lifestyle_choice_prices
    lifestyle_choice_prices = []

    sek_per_ton = 150
    buffer_size = 2

    LifestyleChoice.all.each do |choice|
      price_per_ton_and_month = choice.co2 * sek_per_ton / 12

      if I18n.locale == :en
        price = price_per_ton_and_month / 8.5
        rounded_price_with_buffer = (price * buffer_size).round(1)
      else
        rounded_price_with_buffer = (price_per_ton_and_month * buffer_size / 5).ceil * 5
      end
      
      lifestyle_choice_prices[choice.id] = rounded_price_with_buffer
    end

    lifestyle_choice_prices
  end 
end