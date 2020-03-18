# frozen_string_literal: true

require 'rails_helper'

RSpec.describe LifestyleCalculator do
  describe '#drafts' do
    it 'includes records where version is nil' do
      create(:lifestyle_calculator, version: nil)

      expect(described_class.drafts.count).to eq(1)
    end

    it 'does not include records where version is present' do
      create(:lifestyle_calculator, version: 1)

      expect(described_class.drafts.count).to eq(0)
    end
  end

  describe '#published' do
    before do
      create(:lifestyle_calculator, countries: ['se'], version: nil)
      create(:lifestyle_calculator, countries: ['se'], version: 1)
      create(:lifestyle_calculator, countries: ['se'], version: 2)
      create(:lifestyle_calculator, countries: ['dk'], version: 1)
    end

    it 'includes latest version of each country' do
      expect(described_class.published).to contain_exactly(
        an_object_having_attributes(countries: [ISO3166::Country.new('dk')], version: 1),
        an_object_having_attributes(countries: [ISO3166::Country.new('se')], version: 2)
      )
    end
  end

  describe '#country' do
    it 'is valid when nil' do
      calculator = described_class.new(countries: nil)
      calculator.valid?
      expect(calculator.errors).not_to include(:countries)
    end

    it 'is valid for valid countries' do
      calculator = described_class.new(countries: ['se'])
      calculator.valid?
      expect(calculator.errors).not_to include(:countries)
    end

    it 'is invalid when empty' do
      calculator = described_class.new(countries: [])
      calculator.valid?
      expect(calculator.errors).to include(:countries)
    end

    it 'is invalid for invalid countries' do
      calculator = described_class.new(countries: ['xx'])
      calculator.valid?
      expect(calculator.errors).to include(:countries)
    end
  end

  [
    :region_options, :home_options, :heating_options, :house_age_options, :green_electricity_options, :food_options,
    :car_type_options
  ].each do |options_field|
    describe "##{options_field}" do
      it 'is valid when nil' do
        calculator = described_class.new(options_field => nil)
        calculator.valid?
        expect(calculator.errors).not_to include(options_field)
      end

      it 'is invalid when empty' do
        calculator = described_class.new(options_field => [])
        calculator.valid?
        expect(calculator.errors).to include(options_field)
      end

      it 'is valid when key is snake_case' do
        calculator = described_class.new(
          options_field => [{ key: 'snake_case', formula: '' }]
        )
        calculator.valid?
        expect(calculator.errors).not_to include(options_field)
      end

      it 'is invalid when key is not snake_case' do
        calculator = described_class.new(
          options_field => [{ key: 'invaliD key', formula: '' }]
        )
        calculator.valid?
        expect(calculator.errors).to include(options_field)
      end

      it 'is invalid when formula is not well formed' do
        calculator = described_class.new(
          options_field => [{ key: 'option', formula: '1 2' }]
        )
        calculator.valid?
        expect(calculator.errors).to include(options_field)
      end

      it 'is invalid when containing forbidden characters' do
        calculator = described_class.new(
          options_field => [{ key: 'option', formula: '“2“' }]
        )
        calculator.valid?
        expect(calculator.errors).to include(options_field)
      end
    end
  end

  [
    :housing_formula, :food_formula, :car_formula, :flights_formula, :consumption_formula, :public_formula
  ].each do |formula_field|
    describe "##{formula_field}" do
      it 'is invalid when nil' do
        calculator = described_class.new
        calculator.valid?
        expect(calculator.errors).to include(formula_field)
      end

      it 'is invalid when blank' do
        calculator = described_class.new(formula_field => '')
        calculator.valid?
        expect(calculator.errors).to include(formula_field)
      end

      it 'is invalid when not well formed' do
        calculator = described_class.new(formula_field => '1 2')
        calculator.valid?
        expect(calculator.errors).to include(formula_field)
      end

      it 'is invalid when containing forbidden characters' do
        calculator = described_class.new(formula_field => '“2“')
        calculator.valid?
        expect(calculator.errors).to include(formula_field)
      end
    end
  end

  describe '.find_or_initialize_draft_by_countries' do
    it 'initializes with countries sorted' do
      calculator = described_class.find_or_initialize_draft_by_countries(%w[se dk])

      expect(calculator.countries).to eq([ISO3166::Country.new('dk'), ISO3166::Country.new('se')])
    end

    it 'initializes with version set to nil' do
      calculator = described_class.find_or_initialize_draft_by_countries(%w[se dk])

      expect(calculator.version).to be_nil
    end

    context 'when draft already exists' do
      let!(:existing_draft) do
        create(:lifestyle_calculator, countries: %w[dk se], version: nil)
      end

      it 'finds even when provided countries are not sorted' do
        calculator = described_class.find_or_initialize_draft_by_countries(%w[se dk])

        expect(calculator.id).to eq(existing_draft.id)
      end
    end

    context 'when published calculator for countries exist' do
      let!(:published) do
        create(:lifestyle_calculator, countries: %w[dk se], version: 1)
      end

      it 'does not retrieve published calculator' do
        calculator = described_class.find_or_initialize_draft_by_countries(%w[dk se])

        expect(calculator.new_record?).to be true
      end
    end
  end

  describe '#calculate' do
    let(:answers) do
      {
        region: 'first',
        home: 'apartment',
        heating: 'district',
        house_age: 'pre1920',
        green_electricity: 'yes',
        food: 'omnivore',
        car_type: 'electricity',
        car_distance: 1000,
        flight_hours: 2
      }
    end

    [:housing, :food, :car, :flights, :consumption, :public].each do |category|
      describe "#{category} calculation" do
        let(:subtotal_formula) { "#{category}_formula".to_sym }

        it 'resolves formulas' do
          calculator = build(:lifestyle_calculator, subtotal_formula => '1 + 1')

          result = calculator.calculate(answers)

          expect(result[category]).to eq(GreenhouseGases.new(2))
        end

        it 'makes car_distance available' do
          calculator = build(:lifestyle_calculator, subtotal_formula => 'car_distance')

          result = calculator.calculate(answers)

          expect(result[category]).to eq(GreenhouseGases.new(1000))
        end

        it 'makes flight_hours available' do
          calculator = build(:lifestyle_calculator, subtotal_formula => 'flight_hours')

          result = calculator.calculate(answers)

          expect(result[category]).to eq(GreenhouseGases.new(2))
        end

        it 'ceils results to nearest integer' do
          calculator = build(:lifestyle_calculator, subtotal_formula => '45.2')

          result = calculator.calculate(answers)

          expect(result[category]).to eq(GreenhouseGases.new(46))
        end

        [:region, :home, :heating, :house_age, :green_electricity, :food, :car_type].each do |question|
          it "makes #{question} available" do
            calculator = build(
              :lifestyle_calculator,
              "#{question}_options".to_sym => [{ key: 'option', formula: '10' }],
              subtotal_formula => question.to_s
            )

            result = calculator.calculate(
              answers.merge(question => 'option')
            )

            expect(result[category]).to eq(GreenhouseGases.new(10))
          end

          it "allows formulas in #{question} options" do
            calculator = build(
              :lifestyle_calculator,
              "#{question}_options".to_sym => [{ key: 'option', formula: '10 * 2' }],
              subtotal_formula => question.to_s
            )

            result = calculator.calculate(
              answers.merge(question => 'option')
            )

            expect(result[category]).to eq(GreenhouseGases.new(20))
          end
        end

        context 'when omitting all options and formulas' do
          it 'sets results to 0' do
            calculator = described_class.new

            result = calculator.calculate(answers)

            expect(result[category]).to eq(GreenhouseGases.new(0))
          end
        end
      end
    end

    it 'sums all categories as total' do
      calculator = build(
        :lifestyle_calculator,
        housing_formula: '1',
        food_formula: '2',
        car_formula: '3',
        flights_formula: '4',
        consumption_formula: '5',
        public_formula: '6'
      )

      result = calculator.calculate(answers)

      expect(result[:total]).to eq(GreenhouseGases.new(21))
    end
  end
end
