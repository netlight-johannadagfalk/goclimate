# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ApplicationHelper, type: :helper do
  describe '#price_string' do
    context 'for SEK' do
      it 'generates a localized string' do
        string = helper.price_string(1300, 'sek')

        expect(string).to eq('13 kr')
      end
    end

    context 'for EUR' do
      it 'generates a localized string' do
        string = helper.price_string(1300, 'eur')

        expect(string).to eq('13 €')
      end
    end

    context 'for USD' do
      it 'generates a localized string' do
        string = helper.price_string(1300, 'usd')

        expect(string).to eq('$13')
      end
    end
  end
end
