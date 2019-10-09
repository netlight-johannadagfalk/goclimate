# frozen_string_literal: true

require 'rails_helper'

RSpec.shared_examples 'currency attributes' do |currency_attributes|
  currency_attributes.each do |attribute|
    describe "##{attribute}" do
      it 'persists Currency values' do
        id = create(described_class.to_s.underscore, attribute => Currency::EUR).id

        expect(described_class.find(id).send(attribute)).to eq(Currency::EUR)
      end

      it 'sets string values as Currency' do
        record = described_class.new(attribute => 'eur')

        expect(record.send(attribute)).to eq(Currency::EUR)
      end

      it 'persists string values as Currency' do
        id = create(described_class.to_s.underscore, attribute => 'eur').id

        expect(described_class.find(id).send(attribute)).to eq(Currency::EUR)
      end
    end
  end
end
