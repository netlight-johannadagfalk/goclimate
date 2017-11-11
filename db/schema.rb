# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20171111121915) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

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
    t.string "link"
    t.string "image_url"
    t.string "blog_url"
    t.decimal "longitude", precision: 10, scale: 6
    t.decimal "latitude", precision: 10, scale: 6
    t.integer "carbon_offset"
    t.string "country"
    t.string "offset_type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "cost_in_sek"
    t.datetime "date_bought"
    t.string "invoice_url"
    t.string "certificate_url"
  end

  create_table "stripe_events", force: :cascade do |t|
    t.string "stripe_event_id"
    t.string "stripe_customer_id"
    t.string "stripe_object"
    t.string "stripe_status"
    t.integer "stripe_amount"
    t.datetime "stripe_created"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "currency"
    t.boolean "paid"
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
    t.datetime "last_seen_at"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

end
