# frozen_string_literal: true

module ClimateReports
  class ReportArea < ApplicationRecord
    belongs_to :report, class_name: 'ClimateReports::Report'
    belongs_to :calculator, class_name: 'BusinessCalculators::Calculator'
    has_many :data_requests
    has_many :data_reporters, through: :data_requests
    has_many :reported_data, through: :data_requests

    validates_presence_of :title

    def answers
      all_answers = []
      calculator&.categories&.each do |category|
        category.fields&.each do |field|
          all_answers += field.answers(self).to_a
        end
      end

      all_answers
    end

    def fields
      all_fields = []
      calculator&.categories&.each do |category|
        category.fields&.each do |field|
          all_fields.push(field)
        end
      end

      all_fields
    end

    def number_of_questions
      total = 0
      calculator&.categories&.each do |category|
        total += category.fields&.length
      end

      total
    end

    def number_of_answered_questions(data_reporter = nil)
      total = 0
      calculator&.categories&.each do |category|
        category.fields&.each do |field|
          total += 1 if field.answers?(self, data_reporter)
        end
      end

      total
    end
  end
end
