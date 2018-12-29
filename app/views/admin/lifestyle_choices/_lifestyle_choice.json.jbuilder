# frozen_string_literal: true

json.extract! lifestyle_choice, :id, :name, :category, :version, :co2, :created_at, :updated_at
json.url admin_lifestyle_choice_url(lifestyle_choice, format: :json)
