class AddPriceSubtotalsFields < ActiveRecord::Migration[6.0]
  def change
    add_column :subscription_months, :vat_amount, :integer
    add_column :subscription_months, :price_incl_taxes, :integer

    add_column :flight_offsets, :vat_amount, :integer
    add_column :flight_offsets, :price_incl_taxes, :integer

    add_column :gift_cards, :vat_amount, :integer
    add_column :gift_cards, :price_incl_taxes, :integer

    add_column :climate_report_invoices, :offsetting_subtotal, :integer
    add_column :climate_report_invoices, :report_subtotal, :integer

    add_column :invoices, :offsetting_subtotal, :integer
    add_column :invoices, :consulting_subtotal, :integer
    add_column :invoices, :products_subtotal, :integer
  end
end
