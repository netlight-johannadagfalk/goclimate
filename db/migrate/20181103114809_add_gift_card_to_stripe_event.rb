class AddGiftCardToStripeEvent < ActiveRecord::Migration[5.2]
  def change
    add_column :stripe_events, :gift_card, :boolean, default: false, null: false
  end
end
