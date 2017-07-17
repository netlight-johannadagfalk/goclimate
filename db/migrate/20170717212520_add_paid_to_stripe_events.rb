class AddPaidToStripeEvents < ActiveRecord::Migration[5.1]
  def change
    add_column :stripe_events, :paid, :boolean
  end
end
