# frozen_string_literal: true

module ClimateReports
  class Report < ApplicationRecord
    has_many :areas, class_name: 'ClimateReports::ReportArea', dependent: :destroy
    belongs_to :organization

    accepts_nested_attributes_for :areas, allow_destroy: true, reject_if:
      proc { |attributes|
        attributes['title'].blank?
      }

    validates_presence_of :title, :reporting_period

    def self.model_name
      @model_name ||= ActiveModel::Name.new(self, nil, 'climate_report')
    end
  end
end
