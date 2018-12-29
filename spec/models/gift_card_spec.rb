# frozen_string_literal: true

require 'rails_helper'

RSpec.describe GiftCard do
  describe 'validations' do
    it 'validates key to be unique' do
      existing = create(:gift_card)

      gift_card = GiftCard.new(key: existing.key)

      expect(gift_card).to_not be_valid
    end

    it 'validates key to look like a SHA1 (40 hex characters)' do
      gift_card = build(:gift_card)

      gift_card.key = 'not a sha'

      expect(gift_card).to_not be_valid
    end

    it 'validates number_of_months to be present' do
      gift_card = build(:gift_card)

      gift_card.number_of_months = nil

      expect(gift_card).to_not be_valid
    end
  end

  describe 'callbacks' do
    it 'generates key when creating new gift card' do
      gift_card = GiftCard.create(number_of_months: 6, message: 'test')

      expect(gift_card.key).to be_present
    end

    it 'does not overwrite key when changing existing gift card' do
      gift_card = create(:gift_card)

      expect do
        gift_card.message = 'Something else'
        gift_card.save
      end.to_not(change { gift_card.key })
    end
  end

  describe '#price' do
    it 'calculates price correctly for 3 months' do
      gift_card = GiftCard.new(number_of_months: 3, currency: 'sek')

      # 11 tons/year * 40 kr/ton / 12 months * 2 * 3 months
      expect(gift_card.price).to eq(220)
    end

    it 'calculates price correctly for 6 months' do
      gift_card = GiftCard.new(number_of_months: 6, currency: 'sek')

      # 11 tons/year * 40 kr/ton / 12 months * 2 * 6 months
      expect(gift_card.price).to eq(440)
    end

    context 'with USD' do
      it 'calculates price correctly for 3 months' do
        gift_card = GiftCard.new(number_of_months: 3, currency: 'usd')

        expect(gift_card.price).to eq(27)
      end

      it 'calculates price correctly for 6 months' do
        gift_card = GiftCard.new(number_of_months: 6, currency: 'usd')

        expect(gift_card.price).to eq(54)
      end
    end

    context 'with EUR' do
      it 'calculates price correctly for 3 months' do
        gift_card = GiftCard.new(number_of_months: 3, currency: 'eur')

        expect(gift_card.price).to eq(21)
      end

      it 'calculates price correctly for 6 months' do
        gift_card = GiftCard.new(number_of_months: 6, currency: 'eur')

        expect(gift_card.price).to eq(42)
      end
    end
  end
end
