class RenameStripeEventsToCardCharges < ActiveRecord::Migration[6.0]
  def up
    rename_table :stripe_events, :card_charges
    rename_column :card_charges, :stripe_event_id, :stripe_charge_id
    rename_column :card_charges, :stripe_amount, :amount
    remove_column :card_charges, :stripe_object
    remove_column :card_charges, :stripe_status
    remove_column :card_charges, :stripe_created

    execute <<~SQL
      CREATE OR REPLACE VIEW stripe_events AS
      SELECT
        cc.id,
        cc.created_at,
        cc.updated_at,
        cc.stripe_charge_id AS stripe_event_id,
        cc.stripe_customer_id,
        cc.amount AS stripe_amount,
        cc.currency,
        cc.paid,
        cc.gift_card,
        cc.description,
        cc.flight_offset
      FROM card_charges cc
    SQL
  end

  def down
    execute <<~SQL
      DROP VIEW IF EXISTS stripe_events
    SQL

    add_column :card_charges, :stripe_created, :datetime
    add_column :card_charges, :stripe_status, :string
    add_column :card_charges, :stripe_object, :string
    rename_column :card_charges, :stripe_charge_id, :stripe_event_id
    rename_column :card_charges, :amount, :stripe_amount
    rename_table :card_charges, :stripe_events
  end
end
