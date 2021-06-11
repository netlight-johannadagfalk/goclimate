class CreatePriceIncreaseConfirmation < ActiveRecord::Migration[6.0]
  def change
    create_table :price_increase_confirmations do |t|
      t.timestamps

      t.boolean :accepted

      t.references :user, null: false, foreign_key: true
    end
  end
end
