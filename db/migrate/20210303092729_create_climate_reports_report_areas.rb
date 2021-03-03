class CreateClimateReportsReportAreas < ActiveRecord::Migration[6.0]
  def change
    create_table :climate_reports_report_areas do |t|
      t.timestamps

      t.references :report, null: false, foreign_key: { to_table: :climate_reports_reports }
      t.references :calculator, null: false, foreign_key: { to_table: :business_calculators_calculators }
      t.text :title
    end
  end
end
