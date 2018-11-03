class AddDescriptionToStripeEvent < ActiveRecord::Migration[5.2]
  def change
    add_column :stripe_events, :description, :string
  end
end
