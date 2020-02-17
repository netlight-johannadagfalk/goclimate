class AddFieldsToFlightOffset < ActiveRecord::Migration[6.0]
  def change
    change_table :flight_offsets do |t|
      t.integer :price
      t.text :currency
      t.text :payment_intent_id, index: true
      t.datetime :paid_at
    end

    change_table :gift_cards do |t|
      t.index :payment_intent_id
    end
  end
end
