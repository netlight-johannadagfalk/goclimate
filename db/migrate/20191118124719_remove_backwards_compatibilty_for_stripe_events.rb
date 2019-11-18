class RemoveBackwardsCompatibiltyForStripeEvents < ActiveRecord::Migration[6.0]
  def change
    reversible do |dir|
      dir.up do
        execute <<~SQL
          DROP VIEW IF EXISTS stripe_events
        SQL
      end

      dir.down do
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
    end
  end
end
