class AddFieldsToGiftCards < ActiveRecord::Migration[6.0]
  def change
    change_table :gift_cards do |t|
      t.integer :price
      t.integer :co2e
      t.text :customer_email
      t.text :payment_intent_id
      t.datetime :paid_at
    end
  end
end
