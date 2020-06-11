class DropLifestyleChoices < ActiveRecord::Migration[6.0]
  def up
    drop_table :lifestyle_choices
    drop_table :lifestyle_choices_users
  end
end
