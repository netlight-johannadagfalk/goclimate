# frozen_string_literal: true

json.extract! climate_action, :id, :id, :name, :description, :points, :status, :repeatable, :action_of_the_month,
              :created_at, :updated_at
json.url climate_action_url(climate_action, format: :json)
