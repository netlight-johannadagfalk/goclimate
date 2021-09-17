# frozen_string_literal: true

task update_user_id_in_flight_offset: :environment do
  FlightOffset.where(user_id: nil).each do |flight_offset|
    user = User.find_by_email(flight_offset.email)
    flight_offset.update!(user_id: user.id) if user
  end
end
