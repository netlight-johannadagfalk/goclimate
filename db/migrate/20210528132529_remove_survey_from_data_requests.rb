class RemoveSurveyFromDataRequests < ActiveRecord::Migration[6.0]
  def change
    remove_column :data_requests, :survey, :boolean
  end
end
