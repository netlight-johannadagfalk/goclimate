class AddPeriodLengthToClimateReports < ActiveRecord::Migration[5.2]
  def change
    change_table :climate_reports do |t|
      t.text :calculation_period_length
    end
  end
end
