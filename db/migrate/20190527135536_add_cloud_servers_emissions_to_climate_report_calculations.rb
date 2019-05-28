class AddCloudServersEmissionsToClimateReportCalculations < ActiveRecord::Migration[5.2]
  def change
    change_table :climate_report_calculations do |t|
      t.integer :cloud_servers_emissions
    end
  end
end
