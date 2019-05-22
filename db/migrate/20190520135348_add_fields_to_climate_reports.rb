class AddFieldsToClimateReports < ActiveRecord::Migration[5.2]
  def change
    change_table :climate_reports do |t|
      t.integer :office_area
      t.boolean :consent_to_show_publicly
      t.boolean :green_electricity
      t.boolean :use_electricity_averages
      t.boolean :use_heating_averages
      t.integer :number_of_cloud_servers
      t.boolean :servers_green_electricity
      t.boolean :cloud_servers_green_electricity
      t.text :other_specification
    end
  end
end
