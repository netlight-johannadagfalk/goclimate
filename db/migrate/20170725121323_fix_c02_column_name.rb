class FixC02ColumnName < ActiveRecord::Migration[5.1]
  def change
    rename_column :lifestyle_choices, :c02, :co2
  end
end
