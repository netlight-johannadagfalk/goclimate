class Mailer

  require 'sendgrid-ruby'
  include SendGrid
  require 'json'

  def send_one_more_month_email user

    climate_neutral_months = StripeEvent.charges(user).count
    total_carbon_offset = Project.all.sum("carbon_offset")

    mail = Mail.new
    mail.from = Email.new(email: 'info@goclimateneutral.org', name: 'GoClimateNeutral.org')
    
    personalization = Personalization.new
    personalization.to = Email.new(email: user.email)
    personalization.bcc = Email.new(email: 'info@goclimateneutral.org')
    personalization.bcc = Email.new(email: 'kalle@nilver.se')
    personalization.subject = "Stort Tack!"
    personalization.headers = Header.new(key: 'X-Test', value: 'True')
    personalization.headers = Header.new(key: 'X-Mock', value: 'False')

    mail.asm = ASM.new(group_id: 16739)

    personalization.substitutions = Substitution.new(key: '%months%', value: climate_neutral_months.to_s)
    personalization.substitutions = Substitution.new(key: '%tonnes%', value: total_carbon_offset.to_s)

    mail.personalizations = personalization

    mail.template_id = '3401db51-a0df-4dd2-8f9c-d3dfd3c64430'

    mail.reply_to = Email.new(email: 'info@goclimateneutral.org')

    # puts JSON.pretty_generate(mail.to_json)
    puts mail.to_json

    sg = SendGrid::API.new(api_key: ENV['SENDGRID_API_KEY'], host: 'https://api.sendgrid.com')
    response = sg.client.mail._('send').post(request_body: mail.to_json)
    puts response.status_code
    puts response.body
    puts response.headers
  end
end