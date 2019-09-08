class AddCertificateSentAtAndCertificateRecieverEmailToClimateReportInvoices < ActiveRecord::Migration[5.2]
  def change
    add_column :climate_report_invoices, :certificate_sent_at, :timestamp
    add_column :climate_report_invoices, :certificate_reciever_email, :string
  end
end
