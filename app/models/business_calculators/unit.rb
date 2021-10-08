# frozen_string_literal: true

module BusinessCalculators
  class Unit < ApplicationRecord
    validates_presence_of :key, :name

    def self.model_name
      @model_name ||= ActiveModel::Name.new(self, nil, 'unit')
    end
  end
end
