class AddGiftCardMessageToStripeEvent < ActiveRecord::Migration[5.2]
  def change
    add_column :stripe_events, :gift_card_message, :text
  end
end
