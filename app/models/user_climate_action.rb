# frozen_string_literal: true

class UserClimateAction < ApplicationRecord
  has_many :climate_actions
  has_many :users
end
