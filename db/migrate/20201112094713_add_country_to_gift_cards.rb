class AddCountryToGiftCards < ActiveRecord::Migration[6.0]
  def change
    add_column :gift_cards, :country, :text
  end
end
