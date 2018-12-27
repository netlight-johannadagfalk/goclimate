# frozen_string_literal: true

require 'rails_helper'

RSpec.feature 'Gift cards', type: :feature, js: true do
  scenario 'Purchase gift card' do
    # Gift cards landing page
    visit '/gift_cards'
    click_link '3 months'

    count = ActionMailer::Base.deliveries.count

    # Checkout page
    click_button 'Proceed to checkout'
    within_frame(0) do
      find('input[placeholder=Email]').send_keys('featurespec@example.com')
      find('input[placeholder="Card number"]').send_keys('4242424242424242')
      find('input[placeholder="MM / YY"]').send_keys '522'
      find('input[placeholder=CVC]').send_keys '123'
      click_button 'Pay'
    end

    # Wait for success page to render
    find('.gift_cards-thank_you', wait: 20)

    expect(ActionMailer::Base.deliveries.count).to eq(count + 1)

    # Confirmation page
    expect(page).to have_text 'Thank you for buying a gift card!'
    expect(page).to have_text 'featurespec@example.com'
  end
end
