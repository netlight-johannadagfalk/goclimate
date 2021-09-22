# frozen_string_literal: true

json.array! @climate_actions, partial: 'climate_actions/climate_action', as: :climate_action
