class AddNewsletterTypeToNewsletterSubscribers < ActiveRecord::Migration[6.0]
  def change
    rename_column :newsletter_subscribers, :logged_in_user_id, :user_id

    add_column :newsletter_subscribers, :newsletter_type, :text, default: 'consumer'
  end
end
