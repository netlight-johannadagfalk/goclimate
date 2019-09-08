class AddCertificateSentAtAndCertificateRecieverEmailToInvoices < ActiveRecord::Migration[5.2]
  def change
    add_column :invoices, :certificate_sent_at, :timestamp
    add_column :invoices, :certificate_reciever_email, :string
  end
end
