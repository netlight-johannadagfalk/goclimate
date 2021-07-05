class UserClimateAction < ApplicationRecord
    has_many :climate_actions
    has_many :users
end
