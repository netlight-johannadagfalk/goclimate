require 'rails_helper'

RSpec.feature "Registrations", type: :feature, js: true do
  scenario "New user registers" do
    # Homepage
    visit "/"
    click_link "Offset my impact"

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

  scenario "User signs in" do
    create(:user)

    # Homepage
    visit "/"
    click_link "LOG IN"

    # sign in page
    fill_in "Email", with: "test@test.com"
    fill_in "Password", with: "password"
    click_button "LOG IN"

    # Wait for dashboard to render
    find('.dashboard-index', wait: 20)
    expect(page).to have_text "We have accomplished a lot together!"
  end
end
