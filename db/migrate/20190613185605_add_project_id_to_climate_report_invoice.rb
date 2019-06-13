class AddProjectIdToClimateReportInvoice < ActiveRecord::Migration[5.2]
  def change
    change_table :climate_report_invoices do |t|
      t.references :project
    end
  end
end
