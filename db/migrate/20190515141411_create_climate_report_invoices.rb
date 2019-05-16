class CreateClimateReportInvoices < ActiveRecord::Migration[5.2]
  def change
    create_table :climate_report_invoices do |t|
      t.timestamps
      t.references :climate_report
      t.text :invoice_address
      t.string :vat_number
      t.string :invoice_email
      t.integer :co2e
      t.integer :amount
      t.string :currency
    end
  end
end
