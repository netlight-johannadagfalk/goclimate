class CreateSubscriptionMonths < ActiveRecord::Migration[6.0]
  def change
    create_table :subscription_months do |t|
      t.timestamps
      t.datetime :start_at
      t.integer :co2e
      t.integer :price
      t.text :currency
      t.references :user
      t.references :payment, polymorphic: true
    end
  end
end
