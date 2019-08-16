class AddCommentToInvoices < ActiveRecord::Migration[5.2]
  def change
    add_column :invoices, :comment, :string
  end
end
