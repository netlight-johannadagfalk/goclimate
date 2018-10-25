# frozen_string_literal: true

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
    expect(page).to have_text "We have accomplished a lot together!"
  end

  scenario "New user registers with a 3dsecure card" do
    # Homepage
    visit "/"
    click_link "Offset my impact"

    # Sign up page
    fill_in "Email", with: "test2@example.com"
    fill_in "Password", with: "password"
    within_frame(0) do
      find('input[name=cardnumber]').send_keys('4000000000003063')
      find('input[name=exp-date]').send_keys '522'
      find('input[name=cvc]').send_keys '123'
    end
    click_button "Go Climate Neutral!"

    # Wait for 3dsecure page to render
    find('#test-source-authorize-3ds', wait: 20)

    click_button "Authorize Test Payment"

    # Wait for success page to render
    find('.dashboard-index', wait: 20)

    expect(page).to have_text "Welcome to a climate neutral life"
    expect(page).to have_text "We have accomplished a lot together!"
  end
end
