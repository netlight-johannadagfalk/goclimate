class RemoveCompanyDetailsFromInvoices < ActiveRecord::Migration[5.2]
  def change
    remove_column :invoices, :att, :string
    remove_column :invoices, :adress, :string
    remove_column :invoices, :org_nr, :string
    rename_column :invoices, :company_name, :receiver
  end
end