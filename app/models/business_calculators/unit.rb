# frozen_string_literal: true

module BusinessCalculators
  class Unit < ApplicationRecord
    validates_presence_of :key, :name, :input_type
  end
end
