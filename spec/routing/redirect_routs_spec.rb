# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Routes', type: :routing do
  # to test redirect routing we need to use request helpers
  include RSpec::Rails::RequestExampleGroup

  it 'understands new transparency route' do
    expect(get: 'transparency').to route_to(
      controller: 'welcome',
      action: 'transparency'
    )
  end

  it 'redirects old transparency route' do
    get '/100_percent_transparency'
    expect(response).to redirect_to('/transparency')
  end

  it 'understands new gift cards index route' do
    expect(get: 'gift-cards').to route_to(
      controller: 'gift_cards',
      action: 'index'
    )
  end

  it 'redirects old gift cards index route' do
    get '/gift_cards'
    expect(response).to redirect_to('/gift-cards')
  end

  it 'understands new gift cards thank you route' do
    expect(get: '/gift-cards/key/thank-you').to route_to(
      controller: 'gift_cards',
      action: 'thank_you',
      key: 'key'
    )
  end

  it 'redirects old gift cards thank you route to new' do
    get '/gift_cards/key/thank_you'
    expect(response).to redirect_to('/gift-cards/key/thank-you')
  end

  it 'understands new our_projects route' do
    expect(get: '/climate-projects').to route_to(
      controller: 'projects',
      action: 'index'
    )
  end

  it 'redirects our_projects route to new' do
    get '/our_projects'
    expect(response).to redirect_to('/climate-projects')
  end

  it 'understands new climate-reports route' do
    expect(get: '/business/climate-reports/new').to route_to(
      controller: 'business/climate_reports',
      action: 'new'
    )
  end

  it 'redirects old climate_reports route to new' do
    get '/business/climate_reports/new'
    expect(response).to redirect_to('/business/climate-reports/new')
  end

  it 'understands new climate reports show route' do
    expect(get: '/business/climate-reports/key').to route_to(
      controller: 'business/climate_reports',
      action: 'show',
      key: 'key'
    )
  end

  it 'redirects old climate_reports show route to new' do
    get '/business/climate_reports/key'
    expect(response).to redirect_to('/business/climate-reports/key')
  end

  it 'understands new climate reports invoice show route' do
    expect(get: '/business/climate-reports/key/invoice/thank-you').to route_to(
      controller: 'business/climate_report_invoices',
      action: 'thank_you',
      key: 'key'
    )
  end

  it 'redirects old climate_reports invoice show route to new' do
    get '/business/climate_reports/key/invoice/thank_you'
    expect(response).to redirect_to('/business/climate-reports/key/invoice/thank-you')
  end

  it 'redirects old climate_reports show route with based_on param to new' do
    get '/business/climate_reports/new?based_on=key'
    expect(response).to redirect_to('/business/climate-reports/new?based_on=key')
  end
end
