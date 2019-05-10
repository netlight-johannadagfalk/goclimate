class CreateClimateReports < ActiveRecord::Migration[5.2]
  def change
    create_table :climate_reports do |t|
      t.timestamps

      t.string :key, index: true
      t.string :company_name
      t.string :contact_email
      t.integer :employees
      t.string :country
      t.string :calculation_period
      t.integer :electricity_consumption
      t.integer :heating
      t.integer :number_of_servers
      t.integer :flight_hours
      t.integer :car_distance
      t.integer :meals
      t.integer :meals_vegetarian_share
      t.integer :purchased_computers
      t.integer :purchased_phones
      t.integer :purchased_monitors
      t.integer :other_co2e
    end
  end
end
