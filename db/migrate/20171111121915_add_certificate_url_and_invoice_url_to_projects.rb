class AddCertificateUrlAndInvoiceUrlToProjects < ActiveRecord::Migration[5.1]
  def change
    add_column :projects, :invoice_url, :string
    add_column :projects, :certificate_url, :string
  end
end
