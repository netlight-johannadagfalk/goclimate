# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_11_16_080855) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "api_keys", force: :cascade do |t|
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "key"
    t.string "name"
    t.text "usage_description"
    t.string "contact_name"
    t.string "contact_email"
  end

  create_table "card_charges", force: :cascade do |t|
    t.string "stripe_charge_id"
    t.string "stripe_customer_id"
    t.integer "amount"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "currency"
    t.boolean "paid"
    t.boolean "gift_card", default: false, null: false
    t.string "description"
    t.boolean "flight_offset", default: false, null: false
  end

  # Temporarily added during migration of the above table so tests can run
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

  create_table "climate_report_calculations", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "climate_report_id"
    t.integer "electricity_consumption_emissions"
    t.integer "heating_emissions"
    t.integer "servers_emissions"
    t.integer "flight_emissions"
    t.integer "car_emissions"
    t.integer "meals_emissions"
    t.integer "purchased_computers_emissions"
    t.integer "purchased_phones_emissions"
    t.integer "purchased_monitors_emissions"
    t.integer "other_emissions"
    t.integer "cloud_servers_emissions"
    t.index ["climate_report_id"], name: "index_climate_report_calculations_on_climate_report_id"
  end

  create_table "climate_report_invoices", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "climate_report_id"
    t.text "invoice_address"
    t.string "vat_number"
    t.string "invoice_email"
    t.integer "co2e"
    t.integer "amount"
    t.string "currency"
    t.bigint "project_id"
    t.string "fortnox_id"
    t.datetime "certificate_sent_at"
    t.string "certificate_reciever_email"
    t.index ["climate_report_id"], name: "index_climate_report_invoices_on_climate_report_id"
    t.index ["project_id"], name: "index_climate_report_invoices_on_project_id"
  end

  create_table "climate_reports", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "key"
    t.string "company_name"
    t.string "contact_email"
    t.integer "employees"
    t.string "country"
    t.string "calculation_period"
    t.integer "electricity_consumption"
    t.integer "heating"
    t.integer "number_of_servers"
    t.integer "flight_hours"
    t.integer "car_distance"
    t.integer "meals"
    t.integer "meals_vegetarian_share"
    t.integer "purchased_computers"
    t.integer "purchased_phones"
    t.integer "purchased_monitors"
    t.integer "other_co2e"
    t.integer "office_area"
    t.boolean "consent_to_show_publicly"
    t.boolean "green_electricity"
    t.boolean "use_electricity_averages"
    t.boolean "use_heating_averages"
    t.integer "number_of_cloud_servers"
    t.boolean "servers_green_electricity"
    t.boolean "cloud_servers_green_electricity"
    t.text "other_specification"
    t.text "calculation_period_length"
    t.index ["key"], name: "index_climate_reports_on_key"
  end

  create_table "flight_offsets", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "key"
    t.integer "co2e"
    t.integer "charged_amount"
    t.string "charged_currency"
    t.string "email"
    t.string "stripe_charge_id"
    t.index ["key"], name: "index_flight_offsets_on_key"
  end

  create_table "gift_cards", force: :cascade do |t|
    t.string "key"
    t.integer "number_of_months"
    t.text "message"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "currency"
    t.index ["key"], name: "index_gift_cards_on_key"
  end

  create_table "invoices", force: :cascade do |t|
    t.integer "amount_in_sek"
    t.integer "co2e"
    t.string "receiver"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "project_id"
    t.string "fortnox_id"
    t.string "comment"
    t.datetime "certificate_sent_at"
    t.string "certificate_reciever_email"
    t.index ["project_id"], name: "index_invoices_on_project_id"
  end

  create_table "lifestyle_choices", force: :cascade do |t|
    t.string "name"
    t.string "category"
    t.integer "version"
    t.decimal "co2", precision: 8, scale: 3
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "lifestyle_choices_users", id: false, force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "lifestyle_choice_id"
    t.index ["lifestyle_choice_id"], name: "index_lifestyle_choices_users_on_lifestyle_choice_id"
    t.index ["user_id"], name: "index_lifestyle_choices_users_on_user_id"
  end

  create_table "projects", force: :cascade do |t|
    t.string "name"
    t.string "cdm_url"
    t.string "image_url"
    t.string "blog_url"
    t.decimal "longitude", precision: 10, scale: 6
    t.decimal "latitude", precision: 10, scale: 6
    t.integer "co2e"
    t.string "country"
    t.string "offset_type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "cost_in_sek"
    t.datetime "date_bought"
    t.string "invoice_url"
    t.string "certificate_url"
    t.integer "gold_standard_id"
    t.integer "cdm_id"
    t.integer "start_block"
    t.integer "end_block"
    t.string "gold_standard_url"
  end

  create_table "stripe_payouts", force: :cascade do |t|
    t.string "stripe_payout_id"
    t.integer "amount"
    t.datetime "stripe_created"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "stripe_customer_id"
    t.string "user_name"
    t.string "country"
    t.datetime "subscription_end_at"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "invoices", "projects"
end
