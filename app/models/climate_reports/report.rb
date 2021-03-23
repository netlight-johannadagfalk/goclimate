# frozen_string_literal: true

module ClimateReports
  class Report < ApplicationRecord
    has_many :areas, class_name: 'ClimateReports::ReportArea'
    belongs_to :organization

    accepts_nested_attributes_for :areas, allow_destroy: true, reject_if:
      proc { |attributes|
        attributes['title'].blank?
      }

    validates_presence_of :title, :reporting_period

    before_destroy :destroy_areas

    def self.model_name
      @model_name ||= ActiveModel::Name.new(self, nil, 'climate_report')
    end

    private

    def destroy_areas
      areas.each(&:destroy)
    end
  end
end
