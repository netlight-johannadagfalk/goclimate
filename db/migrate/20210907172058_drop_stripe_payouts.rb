class DropStripePayouts < ActiveRecord::Migration[6.0]
  def change
    drop_table :stripe_payouts do |t|
      t.string "stripe_payout_id"
      t.integer "amount"
      t.datetime "stripe_created"
      t.datetime "created_at", null: false
      t.datetime "updated_at", null: false
    end
  end
end
