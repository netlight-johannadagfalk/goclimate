# frozen_string_literal: true

# Preview all emails at http://localhost:3000/rails/mailers/data_request_mailer
class DataRequestMailerPreview < ActionMailer::Preview
  def data_request_email
    data_reporter = DataReporter.find(2)

    DataRequestMailer.with(
      data_reporter: data_reporter,
      data_request: DataRequest.where(data_reporter_id: data_reporter.id),
      locale: 'sv',
      sender: 'Alexandra'
    ).data_request_email
  end
end
