class CreateGiftCardCertificates < ActiveRecord::Migration[5.2]
  def change
    create_table :gift_card_certificates do |t|
      t.string :key
      t.integer :number_of_months
      t.text :message

      t.timestamps
    end
  end
end
