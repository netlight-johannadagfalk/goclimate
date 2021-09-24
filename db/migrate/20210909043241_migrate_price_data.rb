class MigratePriceData < ActiveRecord::Migration[6.0]
  disable_ddl_transaction!

  def up
    Subscriptions::SubscriptionMonth.where('price_incl_taxes is null').update_all(<<~SQL)
      price_incl_taxes = price,
      price = round(price / 1.25),
      vat_amount = price - round(price / 1.25)
    SQL

    GiftCard.where('price_incl_taxes is null').update_all(<<~SQL)
      price_incl_taxes = price,
      price = round(price / 1.25),
      vat_amount = price - round(price / 1.25)
    SQL

    FlightOffset.where('price_incl_taxes is null').update_all(<<~SQL)
      price_incl_taxes = price,
      price = round(price / 1.25),
      vat_amount = price - round(price / 1.25)
    SQL
  end

  def down
    Subscriptions::SubscriptionMonth.where('price_incl_taxes is not null').update_all(<<~SQL)
      price = price_incl_taxes,
      price_incl_taxes = null,
      vat_amount = null
    SQL

    GiftCard.where('price_incl_taxes is not null').update_all(<<~SQL)
      price = price_incl_taxes,
      price_incl_taxes = null,
      vat_amount = null
    SQL

    FlightOffset.where('price_incl_taxes is not null').update_all(<<~SQL)
      price = price_incl_taxes,
      price_incl_taxes = null,
      vat_amount = null
    SQL
  end
end
