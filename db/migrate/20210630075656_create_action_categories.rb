class CreateActionCategories < ActiveRecord::Migration[6.0]
  def change
    create_table :action_categories, id: false do |t|
      t.primary_key :id
      t.string :name
      t.string :description

      t.timestamps
    end
  end
end
