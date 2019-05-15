# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ClimateReportCalculation do
  subject(:calculation) { described_class.create_from_climate_report(climate_report) }

  let(:climate_report) do
    create(
      :climate_report,
      electricity_consumption: 100,
      heating: 100,
      number_of_servers: 5,
      flight_hours: 10,
      car_distance: 100,
      meals: 100,
      meals_vegetarian_share: 72,
      purchased_computers: 2,
      purchased_phones: 4,
      purchased_monitors: 2,
      other_co2e: 37
    )
  end

  def validate_presence_of(attribute)
    calculation = described_class.create_from_climate_report(climate_report)

    calculation.send("#{attribute}=", nil)
    calculation.validate

    expect(calculation.errors.keys).to include(attribute)
  end

  describe '.create_from_climate_report' do
    subject(:created_calculation) { described_class.create_from_climate_report(climate_report) }

    it 'saves record' do
      expect(created_calculation.persisted?).to be true
    end

    it 'sets association to climate report' do
      expect(created_calculation.climate_report).to eq(climate_report)
    end

    it 'calculates electricity consumption emissions' do
      # 100 kWh * 0.329 kg/kWh (Nordic residual mix) = 32.9 kg
      expect(created_calculation.electricity_consumption_emissions).to eq(33)
    end

    it 'calculates heating emissions' do
      # 100 kWh * 0.071 kg/kWh (Stockholm Exergi) = 7.1 kg
      expect(created_calculation.heating_emissions).to eq(8)
    end

    it 'calculates servers emissions' do
      # 5 servers * 500 kg/server/year = 2500 kg
      expect(created_calculation.servers_emissions).to eq(2_500)
    end

    it 'calculates flight emissions' do
      # 10 hours * 200 kg/h = 2000 kg
      expect(created_calculation.flight_emissions).to eq(2_000)
    end

    it 'calculates car emissions' do
      # 100 km * 0.123 kg/km (average in Sweden) = 12.3 kg
      expect(created_calculation.car_emissions).to eq(13)
    end

    it 'calculates meals emissions' do
      # 72 vegetarian * 2.1 kg + 28 omnivore * 0.7 kg = 109,2 kg
      expect(created_calculation.meals_emissions).to eq(110)
    end

    it 'calculates purchased computers emissions' do
      # 2 computers * 350 kg per computer (slightly higher than a 15" MacBook Pro) = 700 kg
      expect(created_calculation.purchased_computers_emissions).to eq(700)
    end

    it 'calculates purchased phones emissions' do
      # 4 phones * 70 kg per phone (slightly higher than an iPhone XR Max) = 280 kg
      expect(created_calculation.purchased_phones_emissions).to eq(280)
    end

    it 'calculates purchased monitors emissions' do
      # 2 monitors * 500 kg per monitor (based on a Dell U24xx, common in workplaces) = 1000 kg
      expect(created_calculation.purchased_monitors_emissions).to eq(1000)
    end

    it 'sets other emissions from climate report' do
      expect(created_calculation.other_emissions).to eq(climate_report.other_co2e)
    end

    context 'with climate report without optional fields' do
      subject(:created_calculation) do
        described_class.create_from_climate_report(create(:climate_report))
      end

      it 'sets electricity emissions to 0' do
        expect(created_calculation.electricity_consumption_emissions).to eq(0)
      end

      it 'sets heating emissions to 0' do
        expect(created_calculation.heating_emissions).to eq(0)
      end

      it 'sets servers emissions to 0' do
        expect(created_calculation.servers_emissions).to eq(0)
      end

      it 'sets flight emissions to 0' do
        expect(created_calculation.flight_emissions).to eq(0)
      end

      it 'sets car emissions to 0' do
        expect(created_calculation.car_emissions).to eq(0)
      end

      it 'sets meals emissions to 0' do
        expect(created_calculation.meals_emissions).to eq(0)
      end

      it 'sets purchased computers emissions to 0' do
        expect(created_calculation.purchased_computers_emissions).to eq(0)
      end

      it 'sets purchased phones emissions to 0' do
        expect(created_calculation.purchased_phones_emissions).to eq(0)
      end

      it 'sets purchased monitors emissions to 0' do
        expect(created_calculation.purchased_monitors_emissions).to eq(0)
      end
    end
  end

  describe '#total_emissions' do
    it 'sums emissions from each emission area' do
      expect(calculation.total_emissions).to eq(6_681)
    end
  end

  describe '#climate_report' do
    it 'validates presence' do
      validate_presence_of :climate_report
    end
  end

  describe '#electricity_consumption_emissions' do
    it 'validates presence' do
      validate_presence_of :electricity_consumption_emissions
    end
  end

  describe '#heating_emissions' do
    it 'validates presence' do
      validate_presence_of :heating_emissions
    end
  end

  describe '#servers_emissions' do
    it 'validates presence' do
      validate_presence_of :servers_emissions
    end
  end

  describe '#flight_emissions' do
    it 'validates presence' do
      validate_presence_of :flight_emissions
    end
  end

  describe '#car_emissions' do
    it 'validates presence' do
      validate_presence_of :car_emissions
    end
  end

  describe '#meals_emissions' do
    it 'validates presence' do
      validate_presence_of :meals_emissions
    end
  end

  describe '#purchased_computers_emissions' do
    it 'validates presence' do
      validate_presence_of :purchased_computers_emissions
    end
  end

  describe '#purchased_phones_emissions' do
    it 'validates presence' do
      validate_presence_of :purchased_phones_emissions
    end
  end

  describe '#purchased_monitors_emissions' do
    it 'validates presence' do
      validate_presence_of :purchased_monitors_emissions
    end
  end

  describe '#other_emissions' do
    it 'validates presence' do
      validate_presence_of :other_emissions
    end
  end
end
