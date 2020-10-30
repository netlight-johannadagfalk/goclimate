class AlterReferralCodesIndex < ActiveRecord::Migration[6.0]
  def change
    remove_index :referral_codes, :code
    add_index :referral_codes, 'lower(code)'
  end
end
