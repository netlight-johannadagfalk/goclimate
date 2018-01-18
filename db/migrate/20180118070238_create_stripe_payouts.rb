class CreateStripePayouts < ActiveRecord::Migration[5.1]
  def change
    create_table :stripe_payouts do |t|
      t.string :stripe_payout_id
      t.integer :amount
      t.timestamp :stripe_created

      t.timestamps
    end
  end
end
