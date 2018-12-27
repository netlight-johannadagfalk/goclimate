# frozen_string_literal: true

require 'gift_card_certificate_pdf_generator'

class GiftCardCertificatesController < ApplicationController
  def show
    certificate = GiftCardCertificate.find_by_key(certificate_key)
    pdf = GiftCardCertificatePDFGenerator.from_certificate(certificate).generate_pdf

    send_data pdf, filename: 'GoClimateNeutral Gift Card.pdf', type: :pdf
  end

  # This is a preview version of the gift card. Includes sample text and a big EXAMPLE stamp.
  # Optionally, you can include a subscription_months_to_gift query param.
  def example
    number_of_months = (params[:subscription_months_to_gift].presence || 6).to_i

    pdf = GiftCardCertificatePDFGenerator.new(
      message: t('views.gift_cards.example.message_html'),
      number_of_months: number_of_months,
      example: true
    ).generate_pdf

    send_data pdf, filename: 'GoClimateNeutral Gift Card.pdf', type: :pdf, disposition: :inline
  end
end
