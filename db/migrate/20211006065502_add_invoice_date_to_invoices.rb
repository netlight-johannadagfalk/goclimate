class AddInvoiceDateToInvoices < ActiveRecord::Migration[6.0]
  def change
    add_column :invoices, :invoice_date, :datetime
  end
end
