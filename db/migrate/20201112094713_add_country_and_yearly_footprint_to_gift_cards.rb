class AddCountryAndYearlyFootprintToGiftCards < ActiveRecord::Migration[6.0]
  def change
    add_column :gift_cards, :country, :text
    add_column :gift_cards, :yearly_footprint, :integer
  end
end
