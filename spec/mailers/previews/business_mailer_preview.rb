# frozen_string_literal: true

# Preview all emails at http://localhost:3000/rails/mailers/business_mailer
class BusinessMailerPreview < ActionMailer::Preview
  def climate_report_email
    BusinessMailer.with(
      climate_report: ClimateReport.last
    ).climate_report_email
  end
end
