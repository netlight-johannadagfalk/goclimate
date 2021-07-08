class ClimateAction < ApplicationRecord
    belongs_to :climate_action_category 
    has_many :user_climate_actions
end
