class CreateStripeEvents < ActiveRecord::Migration[5.1]
  def change
    create_table :stripe_events do |t|
      t.string :stripe_event_id
      t.string :stripe_customer_id
      t.string :stripe_object
      t.string :stripe_status
      t.integer :stripe_amount
      t.timestamp :stripe_created

      t.timestamps
    end
  end
end
