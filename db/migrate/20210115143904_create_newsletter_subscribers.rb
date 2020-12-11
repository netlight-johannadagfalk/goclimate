class CreateNewsletterSubscribers < ActiveRecord::Migration[6.0]
  def change
    create_table :newsletter_subscribers do |t|
      t.timestamps
      t.string :email, null: false
      t.string :region
      t.bigint :logged_in_user_id
    end

    add_foreign_key :newsletter_subscribers, :users, column: :logged_in_user_id
  end
end
