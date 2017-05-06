class Mailer

  require 'sendgrid-ruby'
  include SendGrid
  require 'json'

  def send_one_more_momth_email

    mail = Mail.new
    mail.from = Email.new(email: 'info@goclimateneutral.org')
    mail.subject = 'One More Month Climate Neutral'

    personalization = Personalization.new
    personalization.to = Email.new(email: 'kalle@nilver.se')
    personalization.subject = '2 Climate Neutral Months! Yey!'
    personalization.headers = Header.new(key: 'X-Test', value: 'True')
    personalization.headers = Header.new(key: 'X-Mock', value: 'False')
    personalization.substitutions = Substitution.new(key: '%months%', value: 2)
    mail.personalizations = personalization

    mail.template_id = '3401db51-a0df-4dd2-8f9c-d3dfd3c64430'

    mail.sections = Section.new(key: '%body%', value: 'You have been 2 months osv')

    mail.headers = Header.new(key: 'X-Test3', value: 'test3')
    mail.headers = Header.new(key: 'X-Test4', value: 'test4')

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