# frozen_string_literal: true

class DataReportersController < ApplicationController
  def show
    @reporter = DataReporter.where(key: params[:id]).first
    @request_items = DataRequest.where(data_reporter_id: @reporter.id).map do |request|
      report_area = ClimateReports::ReportArea.find(request.report_area_id)
      calculator = BusinessCalculators::Calculator.find(report_area.calculator_id)
      {
        data_request: request,
        number_of_questions: report_area.number_of_questions,
        number_of_answered_questions: answered_questions(calculator.survey, report_area)
      }
    end
  end

  private

  def answered_questions(survey, report_area)
    if survey
      report_area.number_of_answered_questions(@reporter)
    else
      report_area.number_of_answered_questions
    end
  end
end
