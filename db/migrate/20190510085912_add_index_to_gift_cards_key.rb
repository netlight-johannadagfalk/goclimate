class AddIndexToGiftCardsKey < ActiveRecord::Migration[5.2]
  def change
    add_index :gift_cards, :key
  end
end
