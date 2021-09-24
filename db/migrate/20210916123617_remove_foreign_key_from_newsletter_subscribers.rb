class RemoveForeignKeyFromNewsletterSubscribers < ActiveRecord::Migration[6.0]
  def change
    remove_foreign_key :newsletter_subscribers, :users, column: :logged_in_user_id
  end
end
