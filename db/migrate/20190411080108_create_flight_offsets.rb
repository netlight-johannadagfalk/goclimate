class CreateFlightOffsets < ActiveRecord::Migration[5.2]
  def change
    create_table :flight_offsets do |t|
      t.string :key
      t.integer :co2e
      t.integer :charged_amount
      t.string :charged_currency
      t.string :email
      t.string :stripe_charge_id
    end
  end
end
