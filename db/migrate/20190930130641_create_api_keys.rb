class CreateApiKeys < ActiveRecord::Migration[6.0]
  def change
    create_table :api_keys do |t|
      t.timestamps

      t.string :key
      t.string :name
      t.text :usage_description
      t.string :contact_name
      t.string :contact_email
    end
  end
end
