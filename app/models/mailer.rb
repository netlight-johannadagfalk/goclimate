# frozen_string_literal: true

class Mailer
  require 'sendgrid-ruby'
  require 'json'
  include SendGrid
  include ActionView::Helpers::NumberHelper

  def send_one_more_month_email(user)
    climate_neutral_months = StripeEvent.payments(user).where(paid: true).count
    total_carbon_offset = Project.total_carbon_offset

    mail = Mail.new
    mail.from = Email.new(email: 'info@goclimateneutral.org', name: 'GoClimateNeutral.org')

    I18n.locale = user.language

    personalization = Personalization.new
    personalization.to = Email.new(email: user.email)
    personalization.subject = I18n.t('thank_you')
    personalization.headers = Header.new(key: 'X-Test', value: 'True')
    personalization.headers = Header.new(key: 'X-Mock', value: 'False')

    mail.asm = ASM.new(group_id: 16739)

    personalization.substitutions = Substitution.new(key: '%thank_you_for_saving_our_planet%', value: I18n.t('thank_you_for_saving_our_planet'))
    personalization.substitutions = Substitution.new(key: '%you_have_lived_a_climate_neutral_life_for%', value: I18n.t('you_have_lived_a_climate_neutral_life_for'))

    personalization.substitutions = Substitution.new(key: '%goclimateneutral_and_this_planet_loves_you%', value: I18n.t('goclimateneutral_and_this_planet_loves_you'))

    personalization.substitutions = Substitution.new(key: '%the_best_way_to_help_is_to_get_as_many_people_climate_neutral_as_possible%', value: I18n.t('the_best_way_to_help_is_to_get_as_many_people_climate_neutral_as_possible'))

    personalization.substitutions = Substitution.new(key: '%goclimateneutral_url%', value: I18n.t('goclimateneutral_url'))

    personalization.substitutions = Substitution.new(key: '%this_mail_was_sent_by%', value: I18n.t('this_mail_was_sent_by'))
    personalization.substitutions = Substitution.new(key: '%to_stop_recieving_these_emails%', value: I18n.t('to_stop_recieving_these_emails'))
    personalization.substitutions = Substitution.new(key: '%click_here%', value: I18n.t('click_here'))

    share_url = I18n.t('goclimateneutral_url') + "users/" + user.id.to_s

    personalization.substitutions = Substitution.new(key: '%facebook_share_url%', value: share_url + "?share=fb")
    personalization.substitutions = Substitution.new(key: '%twitter_share_url%', value: share_url + "?share=tw")

    personalization.substitutions = Substitution.new(key: '%learn_more_about_what_we_have_achieved_here%', value: I18n.t('learn_more_about_what_we_have_achieved_here'))

    if climate_neutral_months % 12 == 0
      if climate_neutral_months / 12 == 1
        personalization.substitutions = Substitution.new(key: '%years%', value: I18n.t('year'))
      else
        personalization.substitutions = Substitution.new(key: '%years%', value: I18n.t('years'))
      end
      personalization.substitutions = Substitution.new(key: '%number_of_years%', value: (climate_neutral_months / 12).to_s)
      personalization.substitutions = Substitution.new(key: '%thats_amazing_from_the_bottom_of_our_hearts%', value: I18n.t('thats_amazing_from_the_bottom_of_our_hearts'))
      mail.template_id = '4498dcc9-8fec-4f18-a92f-e9ef82a3fa59'
    else
      if climate_neutral_months == 1
        personalization.substitutions = Substitution.new(key: '%months%', value: I18n.t('month'))
      else
        personalization.substitutions = Substitution.new(key: '%months%', value: I18n.t('months'))
      end
      personalization.substitutions = Substitution.new(key: '%number_of_months%', value: climate_neutral_months.to_s)
      personalization.substitutions = Substitution.new(key: '%together_we_have_offset%', value: I18n.t('together_we_have_offset'))
      personalization.substitutions = Substitution.new(key: '%tonnes%', value: number_with_delimiter(total_carbon_offset))
      personalization.substitutions = Substitution.new(key: '%tonnes_CO2%', value: I18n.t('tonnes_CO2'))
      mail.template_id = '3401db51-a0df-4dd2-8f9c-d3dfd3c64430'
    end

    mail.personalizations = personalization
    mail.reply_to = Email.new(email: 'info@goclimateneutral.org')

    # puts JSON.pretty_generate(mail.to_json)
    puts mail.to_json

    sg = SendGrid::API.new(api_key: ENV['SENDGRID_API_KEY'], host: 'https://api.sendgrid.com')
    response = sg.client.mail._('send').post(request_body: mail.to_json)
    puts response.status_code
    puts response.body
    puts response.headers
  end

  def send_payment_failed_email(user)
    mail = Mail.new
    mail.from = Email.new(email: 'info@goclimateneutral.org', name: 'GoClimateNeutral.org')

    I18n.locale = user.language

    personalization = Personalization.new
    personalization.to = Email.new(email: user.email)
    personalization.subject = I18n.t('the_payment_unfortunately_failed')
    personalization.headers = Header.new(key: 'X-Test', value: 'True')
    personalization.headers = Header.new(key: 'X-Mock', value: 'False')

    mail.asm = ASM.new(group_id: 16739)

    personalization.substitutions = Substitution.new(key: '%goclimateneutral_url%', value: I18n.t('goclimateneutral_url'))

    personalization.substitutions = Substitution.new(key: '%the_payment_unfortunately_failed%', value: I18n.t('the_payment_unfortunately_failed'))
    personalization.substitutions = Substitution.new(key: '%no_worries_we_will_try_again_within_a_few_days%', value: I18n.t('no_worries_we_will_try_again_within_a_few_days'))
    personalization.substitutions = Substitution.new(key: '%you_might_need_to_update_your_payment_info%', value: I18n.t('you_might_need_to_update_your_payment_info'))
    personalization.substitutions = Substitution.new(key: '%link_to_update_your_payment_info%', value: I18n.t('link_to_update_your_payment_info'))

    personalization.substitutions = Substitution.new(key: '%this_mail_was_sent_by%', value: I18n.t('this_mail_was_sent_by'))
    personalization.substitutions = Substitution.new(key: '%to_stop_recieving_these_emails%', value: I18n.t('to_stop_recieving_these_emails'))
    personalization.substitutions = Substitution.new(key: '%click_here%', value: I18n.t('click_here'))

    mail.personalizations = personalization

    mail.template_id = '0c0781bc-939f-4b65-b850-da8741ea8a04'

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
