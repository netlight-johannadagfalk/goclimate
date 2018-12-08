# frozen_string_literal: true

require 'rails_helper'

RSpec.describe GiftCard do
  describe 'validations' do
    it 'validates key to be unique' do
      existing = create(:gift_card)

      certificate = GiftCard.new(key: existing.key)

      expect(certificate).to_not be_valid
    end

    it 'validates key to look like a SHA1 (40 hex characters)' do
      certificate = build(:gift_card)

      certificate.key = 'not a sha'

      expect(certificate).to_not be_valid
    end

    it 'validates number_of_months to be present' do
      certificate = build(:gift_card)

      certificate.number_of_months = nil

      expect(certificate).to_not be_valid
    end
  end

  describe 'callbacks' do
    it 'generates key when creating new certificates' do
      certificate = GiftCard.create(number_of_months: 6, message: 'test')

      expect(certificate.key).to be_present
    end

    it 'does not overwrite key when changing existing certificates' do
      certificate = create(:gift_card_certificate)

      expect do
        certificate.message = 'Something else'
        certificate.save
      end.to_not(change { certificate.key })
    end
  end
end
