class RemoveLastSeenAtFromUser < ActiveRecord::Migration[5.2]
  def change
    remove_column :users, :last_seen_at, :datetime
  end
end
