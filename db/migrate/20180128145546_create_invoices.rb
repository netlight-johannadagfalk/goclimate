class CreateInvoices < ActiveRecord::Migration[5.1]
  def change
    create_table :invoices do |t|
      t.integer :amount_in_sek
      t.integer :carbon_offset
      t.string :att
      t.string :company_name
      t.string :adress
      t.string :org_nr

      t.timestamps
    end
  end
end
