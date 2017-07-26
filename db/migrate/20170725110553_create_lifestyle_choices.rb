class CreateLifestyleChoices < ActiveRecord::Migration[5.1]
  def change
    create_table :lifestyle_choices do |t|
      t.string :name
      t.string :category
      t.integer :version
      t.decimal :c02, precision: 8, scale: 3

      t.timestamps
    end

    create_table :lifestyle_choices_users, id: false do |t|
      t.belongs_to :user, index: true
      t.belongs_to :lifestyle_choice, index: true
    end
  end
end