# frozen_string_literal: true

class FlightOffsetMailerPreview < ActionMailer::Preview
  def flight_offset_email
    offset = FlightOffset.create!(
      email: 'test@example.com', co2e: 1000, charged_amount: 4000,
      charged_currency: 'sek', stripe_charge_id: 'fake'
    )
    pdf = FlightOffsetCertificatePDFGenerator.new(offset).generate_pdf

    FlightOffsetMailer.with(
      flight_offset: offset,
      certificate_pdf: pdf
    ).flight_offset_email.tap do
      offset.destroy
    end
  end
end
