# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ApplicationHelper, type: :helper do
  describe '#price_string' do
    it 'generates a localized string for SEK' do
      string = helper.price_string(13, 'sek')

      expect(string).to eq('13 kr')
    end

    it 'generates a localized string for EUR' do
      string = helper.price_string(13, 'eur')

      expect(string).to eq('13 €')
    end

    it 'generates a localized string USD' do
      string = helper.price_string(13, 'usd')

      expect(string).to eq('$13')
    end
  end
end
