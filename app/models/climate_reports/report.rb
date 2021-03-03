# frozen_string_literal: true

module ClimateReports
  class Report < ApplicationRecord
    has_many :areas, class_name: 'ClimateReports::ReportArea'

    validates_presence_of :title, :reporting_period
  end
end
