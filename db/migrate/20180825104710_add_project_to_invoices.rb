class AddProjectToInvoices < ActiveRecord::Migration[5.2]
  def change
    add_reference :invoices, :project, index: true
    add_foreign_key :invoices, :projects
  end
end
