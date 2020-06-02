# frozen_string_literal: true

class ApiKeyMailer < ApplicationMailer
  def api_key_email
    @api_key = params[:api_key]

    mail(
      to: @api_key.contact_email,
      subject: 'Your GoClimate API Key'
    )
  end
end
