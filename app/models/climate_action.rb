# frozen_string_literal: true

class ClimateAction < ApplicationRecord
  belongs_to :climate_action_category
  has_many :user_climate_actions
  validates_uniqueness_of :name
end
