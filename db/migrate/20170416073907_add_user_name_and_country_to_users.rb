class AddUserNameAndCountryToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :user_name, :string, :unique => true
    add_column :users, :country, :string
  end
end