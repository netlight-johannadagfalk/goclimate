class AddFlightOffsetToStripeEvent < ActiveRecord::Migration[5.2]
  def change
    add_column :stripe_events, :flight_offset, :boolean, default: false, null: false
  end
end
