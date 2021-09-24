# frozen_string_literal: true

require 'rails_helper'

RSpec.feature 'Newsletter signup', type: :feature, js: true do
  scenario 'Sign up to our newsletter in footer' do
    visit '/'

    fill_in 'newsletter_email', with: 'test@example.com'
    find('#newsletter-subscription-form input').native.send_keys :enter

    expect(page).to have_text('Thank you!', wait: 20)
  end
end
