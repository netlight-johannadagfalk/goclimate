class CreateClimateReportsReports < ActiveRecord::Migration[6.0]
  def change
    create_table :climate_reports_reports do |t|
      t.timestamps

      t.text :title
      t.daterange :reporting_period
    end
  end
end
