require 'rails_helper'

RSpec.feature "Gift cards", type: :feature, js: true do
  scenario "Purchase gift card" do
    # Gift cards landing page
    visit '/gift_cards'
    click_link '3 months'

    # Checkout page
    click_button "Purchase Gift Card"
    within_frame(0) do
      find('input[placeholder=Email]').send_keys('featurespec@example.com')
      find('input[placeholder="Card number"]').send_keys('4242424242424242')
      find('input[placeholder="MM / YY"]').send_keys '522'
      find('input[placeholder=CVC]').send_keys '123'
      click_button "Pay"
    end

    # Wait for success page to render
    find('.gift_cards-create', wait: 20)

    # Confirmation page
    expect(page).to have_text 'Here\'s your gift card'
  end
end
