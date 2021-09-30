class MigrateInvoicesProjectsMoneyData < ActiveRecord::Migration[6.0]
  disable_ddl_transaction!

  def up
    Project.update_all(<<~SQL)
      cost_in_sek = cost_in_sek * 100
    SQL

    Invoice.update_all(<<~SQL)
      amount_in_sek = amount_in_sek * 100
    SQL
  end

  def down
    Project.update_all(<<~SQL)
      cost_in_sek = round(cost_in_sek / 100)
    SQL

    Invoice.update_all(<<~SQL)
      amount_in_sek = round(amount_in_sek / 100)
    SQL
  end
end
