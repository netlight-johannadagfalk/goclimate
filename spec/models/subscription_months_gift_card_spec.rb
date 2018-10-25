# frozen_string_literal: true

require 'rails_helper'

RSpec.describe SubscriptionMonthsGiftCard do
  describe '#initialize' do
    it 'uses provided number of months and currency' do
      gift_card = SubscriptionMonthsGiftCard.new(3, 'SEK')

      expect(gift_card.number_of_months).to eq(3)
      expect(gift_card.currency).to eq('SEK')
    end
  end

  describe '#price' do
    it 'calculates price correctly for 3 months' do
      gift_card = SubscriptionMonthsGiftCard.new(3, 'sek')

      # 11 tons/year * 40 kr/ton / 12 months * 2 * 100 ore * 3 months
      expect(gift_card.price).to eq(22_000)
    end

    it 'calculates price correctly for 6 months' do
      gift_card = SubscriptionMonthsGiftCard.new(6, 'sek')

      # 11 tons/year * 40 kr/ton / 12 months * 2 * 100 ore * 6 months
      expect(gift_card.price).to eq(44_000)
    end

    it 'rounds to something'

    context 'with USD' do
      it 'uses conversion rates correctly'
      it 'rounds to something'
    end

    context 'with EUR' do
      it 'uses conversion rates correctly'
      it 'rounds to something'
    end
  end
end
