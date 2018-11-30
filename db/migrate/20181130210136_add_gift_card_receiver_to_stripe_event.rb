class AddGiftCardReceiverToStripeEvent < ActiveRecord::Migration[5.2]
  def change
    add_column :stripe_events, :gift_card_receiver, :string
  end
end
