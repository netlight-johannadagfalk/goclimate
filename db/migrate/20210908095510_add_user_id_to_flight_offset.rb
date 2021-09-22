class AddUserIdToFlightOffset < ActiveRecord::Migration[6.0]
  def change
    add_reference :flight_offsets, :user, index: true
  end
end
