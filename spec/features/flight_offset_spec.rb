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
      send_keys_to_card_field '4242424242424242'
      find('input[name=exp-date]').send_keys '522'
      find('input[name=cvc]').send_keys '123'
    end

    click_button 'Klimatkompensera'

    # Wait for success page to render
    find('.flight_offsets-thank_you', wait: 30)

    expect(page).to have_text 'Tack!'
  end
end
