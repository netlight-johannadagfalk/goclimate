# frozen_string_literal: true

require 'rails_helper'

RSpec.feature 'Flight offset', type: :feature, js: true do
  scenario 'Offset via partner' do
    visit '/flight_offsets/new?offset_params=economy%2CARN%2CBCN%2CBCN%2CARN'

    expect(page).to have_text('Arlanda')
    expect(page).to have_text('Barcelona')
    expect(page).to have_text('economy')

    fill_in 'email', with: 'test@example.com'
    within_frame(0) do
      find('input[name=cardnumber]').send_keys('4242424242424242')
      find('input[name=exp-date]').send_keys '522'
      find('input[name=cvc]').send_keys '123'
    end

    click_button 'Klimatkompensera'

    # Wait for success page to render
    find('.flight_offsets-thank_you', wait: 20)

    expect(page).to have_text 'Tack!'
  end

  context 'with 3D Secure card' do
    scenario 'Offset via partner' do
      visit '/flight_offsets/new?offset_params=economy%2CARN%2CBCN%2CBCN%2CARN'

      expect(page).to have_text('Arlanda')
      expect(page).to have_text('Barcelona')
      expect(page).to have_text('economy')

      fill_in 'email', with: 'test@example.com'
      within_frame(0) do
        find('input[name=cardnumber]').send_keys('4000000000003063')
        find('input[name=exp-date]').send_keys '522'
        find('input[name=cvc]').send_keys '123'
      end

      click_button 'Klimatkompensera'

      # 3D Secure authorization page
      find('#test-source-authorize-3ds', wait: 20)
      click_button 'Authorize Test Payment'

      # Wait for success page to render
      find('.flight_offsets-thank_you', wait: 20)

      expect(page).to have_text 'Tack!'
    end
  end
end
