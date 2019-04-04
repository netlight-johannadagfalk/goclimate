# frozen_string_literal: true

require 'rails_helper'

RSpec.feature 'Flight offset', type: :feature, js: true do
  scenario 'offset via partner' do
    visit '/flight_offsets/new?offset_params=economy%2CARN%2CBCN%2CBCN%2CARN'

    expect(page).to have_text('Arlanda')
    expect(page).to have_text('Barcelona')
    expect(page).to have_text('economy')
  end
end
