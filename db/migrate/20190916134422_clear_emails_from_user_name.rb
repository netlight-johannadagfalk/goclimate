class ClearEmailsFromUserName < ActiveRecord::Migration[6.0]
  def change
    User.where("user_name like '%@%.%'").update_all(user_name: nil)
  end
end
