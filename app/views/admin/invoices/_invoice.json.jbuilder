# frozen_string_literal: true

json.extract! invoice, :id, :amount_in_sek, :carbon_offset, :att, :company_name, :adress, :org_nr, :created_at,
              :updated_at
json.url admin_invoice_url(invoice, format: :json)
