class AddFortnoxIdToInvoicesAndClimateReportInvoices < ActiveRecord::Migration[5.2]
  def change
    change_table :invoices do |t|
      t.string :fortnox_id
    end

    change_table :climate_report_invoices do |t|
      t.string :fortnox_id
    end

    reversible do |change|
      change.up do
        update <<~SQL
          UPDATE invoices SET fortnox_id = CONCAT('1', LPAD(id::text, 3, '0'))
        SQL
      end
    end
  end
end
