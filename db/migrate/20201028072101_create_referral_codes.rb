class CreateReferralCodes < ActiveRecord::Migration[6.0]
  def change
    create_table :referral_codes do |t|
      t.timestamps
      t.text :code, index: true
      t.text :destination_path
    end

    change_table :users do |t|
      t.belongs_to :referred_from, index: true
    end
  end
end
