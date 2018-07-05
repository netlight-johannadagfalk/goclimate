require 'rails_helper'

RSpec.feature "Registrations", type: :feature, js: true do
  scenario "New user registers" do
    # Homepage
    visit "/"
    click_link "That's it!"

    # Sign up page
    fill_in "Email", with: "test@example.com"
    fill_in "Password", with: "password"
    within_frame(0) do
      find('input[name=cardnumber]').send_keys('4242424242424242')
      find('input[name=exp-date]').send_keys '522'
      find('input[name=cvc]').send_keys '123'
    end
    click_button "Go Climate Neutral!"

    # Wait for success page to render
    find('.dashboard-index', wait: 20)

    expect(page).to have_text "Welcome to a climate neutral life"
  end
end
