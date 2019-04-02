# frozen_string_literal: true

require 'rails_helper'

RSpec.feature 'Registrations', type: :feature, js: true do
  scenario 'Register and update card' do
    # Homepage
    visit '/'
    click_link 'Offset my impact'

    # Sign up page
    fill_in 'Email', with: 'test@example.com'
    fill_in 'Password', with: 'password'
    within_frame(0) do
      find('input[name=cardnumber]').send_keys('4242424242424242')
      find('input[name=exp-date]').send_keys '522'
      find('input[name=cvc]').send_keys '123'
    end
    check 'I accept our Privacy policy'
    click_button 'Go Climate Neutral!'

    # Wait for success page to render
    find('.dashboard-index', wait: 20)

    expect(page).to have_text 'Welcome to a climate neutral life'
    expect(page).to have_text 'We have accomplished a lot together!'

    # Go to payment settings page
    visit '/users/edit'
    find('.registrations-edit', wait: 20)
    click_link 'Payment Settings'
    find('.subscriptions-show', wait: 20)

    expect(page).to have_text 'Payment Settings'

    # Update card
    click_link 'edit card'
    within_frame(0) do
      find('input[name=cardnumber]').send_keys('4242424242424242')
      find('input[name=exp-date]').send_keys '522'
      find('input[name=cvc]').send_keys '123'
    end
    click_button 'Update'

    # Wait for payment page to render
    find('.subscriptions-show', wait: 20)
  end

  context 'when using 3D Secure card' do
    scenario 'Register and update card' do
      # Homepage
      visit '/'
      click_link 'Offset my impact'

      # Sign up page
      fill_in 'Email', with: 'test@example.com'
      fill_in 'Password', with: 'password'
      within_frame(0) do
        find('input[name=cardnumber]').send_keys('4000000000003063')
        find('input[name=exp-date]').send_keys '522'
        find('input[name=cvc]').send_keys '123'
      end
      check 'I accept our Privacy policy'
      click_button 'Go Climate Neutral!'

      # 3D Secure authorization page
      find('#test-source-authorize-3ds', wait: 20)
      click_button 'Authorize Test Payment'

      # Wait for success page to render
      find('.dashboard-index', wait: 20)

      expect(page).to have_text 'Welcome to a climate neutral life'
      expect(page).to have_text 'We have accomplished a lot together!'

      # Go to payment settings page
      visit '/users/edit'
      find('.registrations-edit', wait: 20)
      click_link 'Payment Settings'
      find('.subscriptions-show', wait: 20)

      expect(page).to have_text 'Payment Settings'

      # Update card
      click_link 'edit card'
      within_frame(0) do
        find('input[name=cardnumber]').send_keys('4000000000003063')
        find('input[name=exp-date]').send_keys '522'
        find('input[name=cvc]').send_keys '123'
      end
      click_button 'Update'

      # Wait for 3dsecure page to render
      find('#test-source-authorize-3ds', wait: 20)
      click_button 'Authorize Test Payment'

      # Wait for payment page to render
      find('.subscriptions-show', wait: 20)
    end
  end
end
