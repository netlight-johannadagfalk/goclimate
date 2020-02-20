class RemoveOldFieldsFromFlightOffset < ActiveRecord::Migration[6.0]
  def change
    change_table :flight_offsets do |t|
      t.remove :charged_amount
      t.remove :charged_currency
    end
  end
end
