# frozen_string_literal: true

module Admin
  class DataRequestsController < AdminController
    before_action :set_data_request, only: [:show, :edit, :update, :destroy]

    def index
      @report = ClimateReports::Report.find(params[:report_id]) if params[:report_id]
      @report_area = ClimateReports::ReportArea.find(params[:report_area_id]) if params[:report_area_id]

      @data_requests = if @report_area
                         DataRequest.where(report_area_id: @report_area.id)
                                    .order(data_reporter_id: :asc, created_at: :desc)
                       else
                         DataRequest.all
                       end
    end

    def show
      @data_reporter = DataReporter.find(@data_request.data_reporter_id)
    end

    def new
      @data_request = DataRequest.new
      @report_area = ClimateReports::ReportArea.find(params[:area])
      @report = ClimateReports::Report.find(@report_area.report.id)
    end

    def edit
      @data_reporter = DataReporter.find(@data_request.data_reporter_id)
    end

    def create(report = ClimateReports::ReportArea.find(data_request_params[:area]).report)
      data_request_params[:email].split(',').map(&:strip).each do |email|
        data_reporter = DataReporter.find_or_create_by({ email: email, report: report })

        unless data_reporter.save
          return redirect_to [
            :admin, report
          ], notice: "There was and error and the data reporter with email '#{email}' was not saved!"
        end

        data_request = DataRequest.new(
          {
            report_area_id: data_request_params[:area].to_i,
            data_reporter: data_reporter
          }
        )

        unless data_request.save
          return redirect_to [
            :admin, data_request
          ], notice: "There was and error and the data request for email '#{email}' was not saved!"
        end

        send_email(data_reporter, data_request) if data_request_params[:send_email] == '1'
      end

      redirect_to [
        :admin,
        ClimateReports::Report.find(
          ClimateReports::ReportArea.find(data_request_params[:area]).report_id
        )
      ], notice: 'Data request(s) was successfully created.'
    end

    def update
      unless @data_request.update(data_request_params)
        render :edit
        return
      end

      redirect_to [:admin, @data_request], notice: 'Data request was successfully updated.'
    end

    def destroy
      @data_request.destroy

      redirect_to admin_data_requests_url, notice: 'Data request was successfully destroyed.'
    end

    private

    def set_data_request
      @data_request = DataRequest.find(params[:id])
    end

    def data_request_params
      params.require(:data_request).permit(
        :email,
        :area,
        :sender,
        :subject,
        :message,
        :locale,
        :send_email
      )
    end

    def send_email(data_reporter, data_request)
      DataRequestMailer.with(
        data_reporter: data_reporter,
        data_request: data_request,
        sender: data_request_params[:sender],
        subject: data_request_params[:subject],
        message: data_request_params[:message],
        locale: data_request_params[:locale]
      ).data_request_email.deliver_now
    end
  end
end
