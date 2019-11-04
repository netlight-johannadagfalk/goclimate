class RenameCarbonOffsetToCo2eInInvoice < ActiveRecord::Migration[6.0]
  def up
    rename_column :invoices, :carbon_offset, :co2e
    Invoice.update_all('co2e = co2e * 1000')
  end

  def down
    Invoice.update_all('co2e = co2e / 1000')
    rename_column :invoices, :co2e, :carbon_offset
  end
end
