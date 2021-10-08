class RenameRecipientIdInDataRequest < ActiveRecord::Migration[6.0]
  def change
    rename_column :data_requests, :recipient_id, :data_reporter_id
  end
end
