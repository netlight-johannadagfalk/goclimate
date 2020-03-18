# frozen_string_literal: true

require 'rails_helper'

RSpec.shared_examples 'greenhouse gases attributes' do |greenhouse_gases_attributes|
  greenhouse_gases_attributes.each do |attribute|
    describe "##{attribute}" do
      it 'persists GreenhouseGases values' do
        id = create(described_class.to_s.underscore, attribute => GreenhouseGases.new(12_000)).id

        expect(described_class.find(id).send(attribute)).to eq(GreenhouseGases.new(12_000))
      end

      it 'sets integer values in kgs as GreenhouseGases' do
        record = described_class.new(attribute => 3_000)

        expect(record.send(attribute)).to eq(GreenhouseGases.new(3_000))
      end

      it 'sets nil values to nil' do
        record = described_class.new(attribute => nil)

        expect(record.send(attribute)).to be_nil
      end

      it 'persists integer values in kgs as GreenhouseGases' do
        id = create(described_class.to_s.underscore, attribute => 3_000).id

        expect(described_class.find(id).send(attribute)).to eq(GreenhouseGases.new(3_000))
      end

      it 'coerces string values to Integer' do
        record = described_class.new(attribute => '3000')

        expect(record.send(attribute)).to eq(GreenhouseGases.new(3_000))
      end
    end
  end
end
