# frozen_string_literal: true

require 'rails_helper'

RSpec.describe LifestyleFootprint do
  [
    :lifestyle_calculator, :housing, :food, :car, :flights, :consumption,
    :public, :total, :car_distance_answer, :flight_hours_answer
  ].each do |attribute|
    describe "##{attribute}" do
      it 'validates to be present' do
        footprint = described_class.new
        footprint.valid?
        expect(footprint.errors).to include(attribute)
      end
    end
  end

  [
    :region, :home, :heating, :house_age, :green_electricity, :food, :car_type
  ].each do |category|
    field = "#{category}_answer".to_sym

    describe "##{field}" do
      context 'when calculator skips question' do
        let(:calculator) do
          build(:lifestyle_calculator, "#{category}_options": nil)
        end

        it 'allows nil' do
          footprint = described_class.new(lifestyle_calculator: calculator)
          footprint.valid?
          expect(footprint.errors).not_to include(field)
        end
      end

      context 'when calculator has options' do
        let(:calculator) do
          build(
            :lifestyle_calculator,
            "#{category}_options": [{ key: 'option', formula: '1' }]
          )
        end

        it 'allows options that exist in calculator' do
          footprint = described_class.new(lifestyle_calculator: calculator)
          footprint.attributes = { field => 'option' }
          footprint.valid?
          expect(footprint.errors).not_to include(field)
        end

        it 'validates to be option that exists in calculator' do
          footprint = described_class.new(lifestyle_calculator: calculator)
          footprint.attributes = { field => 'not_an_option' }
          footprint.valid?
          expect(footprint.errors).to include(field)
        end
      end
    end
  end

  describe '#key' do
    it 'validates key to be unique' do
      existing = create(:lifestyle_footprint)

      footprint = described_class.new(key: existing.key)
      footprint.valid?

      expect(footprint.errors).to include(:key)
    end

    it 'validates key to look like a SHA1 (40 hex characters)' do
      footprint = build(:lifestyle_footprint)

      footprint.key = 'not a sha'
      footprint.valid?

      expect(footprint.errors).to include(:key)
    end

    it 'generates key when new' do
      footprint = create(:lifestyle_footprint, key: nil)

      expect(footprint.key).to be_present
    end

    it 'does not overwrite existing key' do
      footprint = create(:lifestyle_footprint)

      expect do
        footprint.total = 1
        footprint.save
      end.not_to change(footprint, :key)
    end
  end

  describe '#update_from_lifestyle_calculator' do
    subject(:footprint) do
      described_class.new(
        lifestyle_calculator: calculator,
        region_answer: 'region',
        home_answer: 'home',
        heating_answer: 'heating',
        house_age_answer: 'house_age',
        green_electricity_answer: 'green_electricity',
        food_answer: 'food',
        car_type_answer: 'car_type',
        car_distance_answer: '1',
        flight_hours_answer: '2'
      )
    end

    results = {
      housing: GreenhouseGases.new(1),
      food: GreenhouseGases.new(2),
      car: GreenhouseGases.new(3),
      flights: GreenhouseGases.new(4),
      consumption: GreenhouseGases.new(5),
      public: GreenhouseGases.new(6)
    }
    let(:calculator) do
      build(:lifestyle_calculator).tap do |calculator|
        allow(calculator).to receive(:calculate).and_return(results)
      end
    end

    it 'sets calculator' do
      footprint.update_from_lifestyle_calculator

      expect(footprint.lifestyle_calculator).to be(calculator)
    end

    it 'passes answer attributes to calculator' do
      footprint.update_from_lifestyle_calculator

      expect(calculator).to have_received(:calculate).with(
        hash_including(
          region: 'region',
          home: 'home',
          heating: 'heating',
          house_age: 'house_age',
          green_electricity: 'green_electricity',
          food: 'food',
          car_type: 'car_type',
          car_distance: 1,
          flight_hours: 2
        )
      )
    end

    results.each do |category, result|
      it "sets #{category} from results" do
        footprint.update_from_lifestyle_calculator

        expect(footprint.send(category)).to eq(result)
      end
    end
  end
end
