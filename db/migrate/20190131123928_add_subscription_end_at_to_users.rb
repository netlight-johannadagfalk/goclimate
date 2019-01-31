class AddSubscriptionEndAtToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :subscription_end_at, :datetime
  end
end
