class AddCurrencyToGiftCard < ActiveRecord::Migration[5.2]
  def change
    add_column :gift_cards, :currency, :string
  end
end
