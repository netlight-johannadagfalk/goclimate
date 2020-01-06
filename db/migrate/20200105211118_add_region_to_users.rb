class AddRegionToUsers < ActiveRecord::Migration[6.0]
  def up
    add_column :users, :region, :string

    User.all.each do |u|
      Rails.logger.debug "Setting region for user #{u.id}"

      u.region = 
        if u.card_charges.first.present? && u.card_charges.first.currency == 'sek'
          Region.find('se')
        elsif u.card_charges.first.present? && u.card_charges.first.currency == 'eur'
          Region.find('de') # set all eur to de now, manually change probable non-de users later in prod
        else
          Region.find('us')
        end
      u.save!
    end
  end

  def down
    remove_column :users, :region
  end
end
