class AddCurrencyToStripeEvents < ActiveRecord::Migration[5.1]
  def change
    add_column :stripe_events, :currency, :string
  end
end