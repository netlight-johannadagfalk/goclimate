class CreateLifestyleFootprints < ActiveRecord::Migration[6.0]
  def change
    create_table :lifestyle_footprints do |t|
      t.timestamps
      t.text :key
      t.references :lifestyle_calculator
      t.references :user
      t.text :region_answer
      t.text :home_answer
      t.text :heating_answer
      t.text :house_age_answer
      t.text :green_electricity_answer
      t.text :food_answer
      t.text :car_type_answer
      t.integer :car_distance_answer
      t.integer :flight_hours_answer
      t.integer :housing
      t.integer :food
      t.integer :car
      t.integer :flights
      t.integer :consumption
      t.integer :public
      t.integer :total
    end
  end
end
