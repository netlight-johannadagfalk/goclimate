class ClimateActionCategory < ApplicationRecord
    has_many :climate_actions , foreign_key: 'climate_action_id'
end
