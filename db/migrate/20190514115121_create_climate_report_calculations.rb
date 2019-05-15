class CreateClimateReportCalculations < ActiveRecord::Migration[5.2]
  def change
    create_table :climate_report_calculations do |t|
      t.timestamps
      t.references :climate_report
      t.integer :electricity_consumption_emissions
      t.integer :heating_emissions
      t.integer :servers_emissions
      t.integer :flight_emissions
      t.integer :car_emissions
      t.integer :meals_emissions
      t.integer :purchased_computers_emissions
      t.integer :purchased_phones_emissions
      t.integer :purchased_monitors_emissions
      t.integer :other_emissions
    end
  end
end
