# frozen_string_literal: true

class ClimateActionCategory < ApplicationRecord
  has_many :climate_actions, foreign_key: 'climate_action_id'
  validates_uniqueness_of :name
end
