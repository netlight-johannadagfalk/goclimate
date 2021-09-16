# frozen_string_literal: true

module Admin
  class ReportedDatasController < AdminController
    before_action :set_report, only: [:index, :export_to_xlsx]
    before_action :set_report_area, only: [:index, :export_to_xlsx]
    before_action :set_report_areas, only: [:index, :export_to_xlsx]

    def index
    end

    def export_to_xlsx(axlsx_package = Axlsx::Package.new)
      workbook = axlsx_package.workbook

      @report_areas.each do |report_area|
        workbook.add_worksheet(name: "#{report_area.title}#{' (survey)' if report_area.calculator.survey}") do |sheet|
          sheet.add_row([
                          'Question',
                          'Answer',
                          'Unit',
                          'Created at',
                          'User email',
                          'Answer ID'
                        ], style: sheet.styles.add_style(b: true))

          report_area.fields.each do |calculator_field|
            answers = calculator_field.answers(report_area)

            (answers.empty? ? 1 : answers.length).times do |answer_index|
              sheet.add_row([
                              answer_index > 0 ? '' : calculator_field.label,
                              answers[answer_index]&.value || '-',
                              answers[answer_index]&.unit,
                              answers[answer_index]&.created_at.to_s,
                              answers[answer_index]&.data_request&.data_reporter&.email,
                              answers[answer_index]&.id
                            ])
            end
          end
        end
      end

      send_data(axlsx_package.to_stream.read, type: 'application/xlsx', filename: 'reported_data.xlsx',
                                              disposition: 'attachment')
    end

    private

    def set_report
      @report = ClimateReports::Report.find(params[:report_id]) if params[:report_id]
    end

    def set_report_area
      @report_area = ClimateReports::ReportArea.find(params[:report_area_id]) if params[:report_area_id]
    end

    def set_report_areas
      @report_areas = @report&.areas || [@report_area]
    end
  end
end
