# frozen_string_literal: true

require 'rails_helper'

RSpec.feature 'Subscription receipts', type: :feature, js: true do
  let(:user) do
    create(:user, email: 'test@example.com', password: 'password', stripe_customer_id: 'cus_TEST', region: 'us')
  end

  before do
    create(:card_charge_monthly, stripe_customer_id: user.stripe_customer_id)
  end

  scenario 'Download receipt' do
    visit '/users/receipts'

    # Log in
    log_in(user)

    # Verify that receipts are shown
    expect(page).to have_text('View receipt')

    # Download receipt
    click_link 'View receipt' # We're not verifying content here, but crashes will be caught
  end
end
