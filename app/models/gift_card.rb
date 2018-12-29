# frozen_string_literal: true

require 'digest'

class GiftCard < ApplicationRecord
  PRICE_PER_MONTH =
    BigDecimal(11) * LifestyleChoice::SEK_PER_TONNE / 12 * 2

  validates :key, uniqueness: true, format: { with: /[a-f0-9]{40}/ }
  validates_presence_of :number_of_months

  before_validation :generate_key

  def price
    case currency
    when 'sek'
      (PRICE_PER_MONTH * number_of_months).to_i
    when 'usd'
      ((PRICE_PER_MONTH / LifestyleChoice::SEK_PER_USD).round * number_of_months).to_i
    when 'eur'
      ((PRICE_PER_MONTH / LifestyleChoice::SEK_PER_EUR).round * number_of_months).to_i
    end
  end

  private

  def generate_key
    self.key = Digest::SHA1.hexdigest("#{Time.now}#{number_of_months}#{message}") unless key.present?
  end
end
