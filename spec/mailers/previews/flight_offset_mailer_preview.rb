# frozen_string_literal: true

class FlightOffsetMailerPreview < ActionMailer::Preview
  def flight_offset_email
    offset = FlightOffset.create!(
      email: 'test@example.com', co2e: 1000, price: 4000,
      currency: 'sek', stripe_charge_id: 'fake'
    )
    pdf = FlightOffsetCertificatePdf.new(offset).render

    FlightOffsetMailer.with(
      flight_offset: offset,
      certificate_pdf: pdf
    ).flight_offset_email.tap do
      offset.destroy
    end
  end
end
