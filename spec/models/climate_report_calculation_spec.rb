# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ClimateReportCalculation do
  subject(:calculation) { described_class.create_from_climate_report!(climate_report) }

  let(:climate_report_attributes) { {} }
  let(:climate_report) do
    create(
      :climate_report,
      {
        employees: 10,
        office_area: 120,
        electricity_consumption: 100,
        heating: 100,
        number_of_servers: 5,
        number_of_cloud_servers: 3,
        flight_hours: 10,
        car_distance: 100,
        meals: 100,
        meals_vegetarian_share: 72,
        purchased_computers: 2,
        purchased_phones: 4,
        purchased_monitors: 2,
        other_co2e: 37
      }.merge(climate_report_attributes)
    )
  end

  def validate_presence_of(attribute)
    calculation = described_class.create_from_climate_report!(climate_report)

    calculation.send("#{attribute}=", nil)
    calculation.validate

    expect(calculation.errors.keys).to include(attribute)
  end

  describe '.create_from_climate_report!' do
    subject(:created_calculation) { described_class.create_from_climate_report!(climate_report) }

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

    context 'when electricity is not given' do
      let(:climate_report_attributes) do
        { electricity_consumption: nil }
      end

      it 'calculates emissions to 0 ' do
        # 1000 kWh * 0.006 kg/kWh (scope 3 emissions) ceiled = 6 kg
        expect(created_calculation.electricity_consumption_emissions).to eq(0)
      end
    end

    context 'when electricity is green' do
      let(:climate_report_attributes) do
        { green_electricity: true,
          electricity_consumption: 1000 }
      end

      it 'calculates with scope 3 emissions from green electricity ' do
        # 1000 kWh * 0.006 kg/kWh (scope 3 emissions) ceiled = 6 kg
        expect(created_calculation.electricity_consumption_emissions).to eq(6)
      end
    end

    context 'when exact electricity values are not known' do
      let(:climate_report_attributes) do
        { use_electricity_averages: true }
      end

      it 'calculates electricity consumption emissions using average values' do
        # 120 sqm * 122 kwH/sqm/yr * 0.329 kg/kWh (Nordic residual mix) = 32.9 kg
        expect(created_calculation.electricity_consumption_emissions).to eq(4817)
      end
    end

    context 'when exact electricity values are not known and office area is not provided' do
      let(:climate_report_attributes) do
        {
          office_area: nil,
          use_electricity_averages: true
        }
      end

      it 'calculates electricity consumption emissions using averages for both office area and consumption' do
        # 10 employees * 15 sqm/employee * 122 kwH/sqm/yr * 0.329 kg/kWh (Nordic residual mix) = 32.9 kg
        expect(created_calculation.electricity_consumption_emissions).to eq(6021)
      end
    end

    it 'calculates heating emissions' do
      # 100 kWh * 0.06592 kg/kWh (Swedish average) = 6.6 kg
      expect(created_calculation.heating_emissions).to eq(7)
    end

    context 'when heating consumption is not known' do
      let(:climate_report_attributes) do
        { use_heating_averages: true }
      end

      it 'calculates heating emissions using average values' do
        # 120 sqm * 117 kwH/sqm/yr * 0.06592 kg/kWh (Swedish average) = 925.5 kg
        expect(created_calculation.heating_emissions).to eq(926)
      end
    end

    context 'when heating consumption is not known and office area is not provided' do
      let(:climate_report_attributes) do
        {
          office_area: nil,
          use_heating_averages: true
        }
      end

      it 'calculates heating emissions using averages for both office area and consumption' do
        # 10 employees * 15 sqm/employee * 117 kwH/sqm/yr * 0.06592 kg/kWh (Swedish average) = 1156.9 kg
        expect(created_calculation.heating_emissions).to eq(1_157)
      end
    end

    it 'calculates servers emissions' do
      # 5 servers * 899 kg/server/year = 4495 kg
      expect(created_calculation.servers_emissions).to eq(4_495)
    end

    context 'when servers use green electricity' do
      let(:climate_report_attributes) do
        { servers_green_electricity: true }
      end

      it 'calculates server emissions with green factors' do
        # 5 servers * 320 kg/server/year = 1600 kg
        expect(created_calculation.servers_emissions).to eq(1_600)
      end
    end

    it 'calculates cloud servers emissions' do
      # 3 servers * 450 kg/server/year = 1350 kg
      expect(created_calculation.cloud_servers_emissions).to eq(1_350)
    end

    context 'when cloud servers use green electricity' do
      let(:climate_report_attributes) do
        { cloud_servers_green_electricity: true }
      end

      it 'calculates server emissions with green factors' do
        # 3 servers * 160 kg/server/year = 480 kg
        expect(created_calculation.cloud_servers_emissions).to eq(480)
      end
    end

    it 'calculates flight emissions' do
      # 10 hours * 200 kg/h = 2000 kg
      expect(created_calculation.flight_emissions).to eq(2_000)
    end

    it 'calculates car emissions' do
      # 100 km * 0.122 kg/km (average in Sweden) = 12.2 kg
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
        described_class.create_from_climate_report!(create(:climate_report))
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

    context 'when calculation period length is half-year' do
      let(:climate_report_attributes) do
        {
          calculation_period_length: 'half-year',
          use_electricity_averages: true,
          use_heating_averages: true
        }
      end

      it 'calculates electricity consumption emissions using average values' do
        # 120 sqm * 122 kwH/sqm/yr * 0.329 kg/kWh (Nordic residual mix) / 2 = 2408.3 kg
        expect(created_calculation.electricity_consumption_emissions).to eq(2_409)
      end

      it 'calculates heating emissions using average values' do
        # 120 sqm * 117 kwH/sqm/yr * 0.06592 kg/kWh (Swedish average) / 2 = 462.8 kg
        expect(created_calculation.heating_emissions).to eq(463)
      end

      it 'calculates servers emissions' do
        # 5 servers * 899 kg/server/year / 2 = 2247.5 kg
        expect(created_calculation.servers_emissions).to eq(2248)
      end

      it 'calculates cloud servers emissions' do
        # 3 servers * 450 kg/server/year / 2 = 675 kg
        expect(created_calculation.cloud_servers_emissions).to eq(675)
      end
    end

    context 'when calculation period length is half-year' do
      let(:climate_report_attributes) do
        {
          calculation_period_length: 'quarter',
          use_electricity_averages: true,
          use_heating_averages: true
        }
      end

      it 'calculates electricity consumption emissions using average values' do
        # 120 sqm * 122 kwH/sqm/yr * 0.329 kg/kWh (Nordic residual mix) / 4 = 1204.1 kg
        expect(created_calculation.electricity_consumption_emissions).to eq(1_205)
      end

      it 'calculates heating emissions using average values' do
        # 120 sqm * 117 kwH/sqm/yr * 0.06592 kg/kWh (Swedish average) / 4 = 231.4 kg
        expect(created_calculation.heating_emissions).to eq(232)
      end

      it 'calculates servers emissions' do
        # 5 servers * 899 kg/server/year / 4 = 1123.8 kg
        expect(created_calculation.servers_emissions).to eq(1124)
      end

      it 'calculates cloud servers emissions' do
        # 3 servers * 450 kg/server/year / 4 = 337.5 kg
        expect(created_calculation.cloud_servers_emissions).to eq(338)
      end
    end
  end

  describe '#total_emissions' do
    it 'sums emissions from each emission area' do
      expect(calculation.total_emissions).to eq(10_025)
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

  describe '#cloud_servers_emissions' do
    it 'validates presence' do
      validate_presence_of :cloud_servers_emissions
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
