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

    def self.joins_report_areas
      joins(
        'INNER JOIN climate_reports_report_areas ON climate_reports_report_areas.report_id = climate_reports_reports.id'
      )
    end

    def answers
      all_answers = []
      areas&.each do |area|
        all_answers += area.answers
      end

      all_answers
    end

    def number_of_questions
      total = 0
      areas&.each do |area|
        total += area.number_of_questions
      end

      total
    end

    def number_of_answered_questions
      total = 0
      areas&.each do |area|
        total += area.number_of_answered_questions
      end

      total
    end
  end
end
