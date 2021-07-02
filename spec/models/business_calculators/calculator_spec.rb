# frozen_string_literal: true

require 'rails_helper'

RSpec.describe BusinessCalculators::Calculator, type: :model do
  subject(:calculator) { build(:business_calculator) }

  describe '#model_name' do
    it 'return correct model name' do
      expect(calculator.model_name).to eq('business_calculator')
    end
  end

  describe '#draft?' do
    it 'returns true when no status has been defined' do
      expect(calculator.draft?).to eq(true)
    end

    context 'when calculator is published' do
      subject(:calculator) { build(:business_calculator_published) }

      it 'returns false' do
        expect(calculator.draft?).to eq(false)
      end
    end
  end

  describe '#duplicate ' do
    it 'duplicates a simple calculator ' do
      calculator.duplicate

      expect(described_class.last.name).to eq("#{calculator.name} (copy)")
    end

    context 'when calculator has categories and fields' do
      subject(:calculator) { build(:business_calculator_with_category_and_field) }

      it 'can retrieve its categories' do
        expect(calculator.categories.length).to be > 0
      end

      it 'can retrieve its fields' do
        expect(calculator.categories.first.fields.length).to be > 0
      end

      it 'duplicates a calculator and its categories' do
        calculator.duplicate

        expect(described_class.last.categories.length).to eq(calculator.categories.length)
      end

      it 'duplicates a calculator and its fields' do
        calculator.duplicate

        expect(described_class.last.categories.first.fields.length).to eq(calculator.categories.first.fields.length)
      end
    end
  end
end
