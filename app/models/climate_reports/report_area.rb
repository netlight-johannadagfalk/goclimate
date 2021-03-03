# frozen_string_literal: true

module ClimateReports
  class ReportArea < ApplicationRecord
    belongs_to :report, class_name: 'ClimateReports::Report'
    belongs_to :calculator, class_name: 'BusinessCalculator::Calculator'

    validates_presence_of :title
  end
end
