# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::FlightFootprintsController do
  let(:blocket_api_key) { '***REMOVED***' }
  let(:request_params) do
    {
      segments: {
        '0': {
          flight: 'VY1266',
          origin: 'ARN',
          destination: 'BCN'
        }
      },
      cabin_class: 'economy',
      currencies: [
        'SEK'
      ]
    }
  end
  let(:request_params_with_two_segments) do
    request_params.deep_merge(
      segments: { '1': {
        flight: 'VY1265',
        origin: 'BCN',
        destination: 'ARN'
      } }
    )
  end

  shared_examples 'GET /v1/flight_footprint' do
    it 'returns 200 OK for successful requests' do
      get '/api/v1/flight_footprint', headers: auth_headers(blocket_api_key), params: request_params

      expect(response).to have_http_status(:ok)
    end

    it 'sets Cache-control headers' do
      get '/api/v1/flight_footprint', headers: auth_headers(blocket_api_key), params: request_params

      expect(response.headers['Cache-control']).to match(/max-age=\d+, public/)
    end

    it 'sets max-age to between 7 and 14 days' do
      get '/api/v1/flight_footprint', headers: auth_headers(blocket_api_key), params: request_params

      max_age = response.headers['Cache-control'].match(/max-age=(\d+), public/)[1].to_i
      expect(max_age).to be_between(7.days.to_i, 14.days.to_i)
    end

    it 'randomizes max-age within range' do
      get '/api/v1/flight_footprint', headers: auth_headers(blocket_api_key), params: request_params
      first_max_age = response.headers['Cache-control'].match(/max-age=(\d+), public/)[1].to_i

      get '/api/v1/flight_footprint', headers: auth_headers(blocket_api_key), params: request_params
      second_max_age = response.headers['Cache-control'].match(/max-age=(\d+), public/)[1].to_i

      expect(first_max_age).not_to eq(second_max_age)
    end

    it 'includes estimated footprint in response' do
      get '/api/v1/flight_footprint', headers: auth_headers(blocket_api_key), params: request_params

      expect(response.parsed_body['footprint']).to eq(500)
    end

    it 'includes offset price in response' do
      get '/api/v1/flight_footprint', headers: auth_headers(blocket_api_key), params: request_params

      expect(response.parsed_body['offset_prices'].first).to be_present
    end

    it 'includes offset price amount in response' do
      get '/api/v1/flight_footprint', headers: auth_headers(blocket_api_key), params: request_params

      expect(response.parsed_body['offset_prices'].first['amount']).to eq(2000)
    end

    it 'includes offset price currency in response' do
      get '/api/v1/flight_footprint', headers: auth_headers(blocket_api_key), params: request_params

      expect(response.parsed_body['offset_prices'].first['currency']).to eq('SEK')
    end

    it 'includes details URL in response' do
      get '/api/v1/flight_footprint', headers: auth_headers(blocket_api_key), params: request_params

      expect(response.parsed_body['details_url']).to end_with('/flight_offsets/new?offset_params=economy%2CARN%2CBCN')
    end

    it 'allows currencies as hashes' do
      get '/api/v1/flight_footprint', headers: auth_headers(blocket_api_key),
                                      params: request_params.merge(currencies: { '0' => 'SEK' })

      expect(response).to have_http_status(:ok)
    end

    context 'when not providing correct attributes' do
      it 'returns 400 Bad Request when cabin class is not one of valid values' do
        get '/api/v1/flight_footprint', headers: auth_headers(blocket_api_key),
                                        params: request_params.merge(cabin_class: 'invalid')

        expect(response).to have_http_status(:bad_request)
      end

      it 'returns 400 Bad Request when currency is not one of valid values' do
        get '/api/v1/flight_footprint', headers: auth_headers(blocket_api_key),
                                        params: request_params.merge(currencies: ['invalid'])

        expect(response).to have_http_status(:bad_request)
      end
    end

    context 'when providing invalid API keys' do
      it 'returns 401 Unauthorized when not providing an API key' do
        get '/api/v1/flight_footprint'

        expect(response).to have_http_status(:unauthorized)
      end

      it 'returns 401 Unauthorized when providing an invalid API key' do
        get '/api/v1/flight_footprint', headers: auth_headers('INVALID_KEY')

        expect(response).to have_http_status(:unauthorized)
      end

      it 'responds with error type when not providing an API key' do
        get '/api/v1/flight_footprint'

        expect(response.parsed_body['type']).to eq('authentication_error')
      end
    end
  end

  describe 'GET /v1/flight_footprint' do
    include_examples 'GET /v1/flight_footprint'

    context 'when not providing correct attributes' do
      it 'returns 400 Bad Request when flight is missing' do
        get '/api/v1/flight_footprint', headers: auth_headers(blocket_api_key),
                                        params: request_params.deep_merge(segments: { '0': { flight: nil } })

        expect(response).to have_http_status(:bad_request)
      end

      it 'returns 400 Bad Request when origin is missing' do
        get '/api/v1/flight_footprint', headers: auth_headers(blocket_api_key),
                                        params: request_params.deep_merge(segments: { '0': { origin: nil } })

        expect(response).to have_http_status(:bad_request)
      end

      it 'returns 400 Bad Request when destination is missing' do
        get '/api/v1/flight_footprint', headers: auth_headers(blocket_api_key),
                                        params: request_params.deep_merge(segments: { '0': { destination: nil } })

        expect(response).to have_http_status(:bad_request)
      end

      it 'responds with error type when parameters are missing' do
        get '/api/v1/flight_footprint', headers: auth_headers(blocket_api_key),
                                        params: request_params.deep_merge(segments: { '0': { flight: nil } })

        expect(response.parsed_body['type']).to eq('invalid_request_error')
      end
    end
  end

  describe 'GET /v1/flight_footprint (deprecated behavior)' do
    let(:request_params) do
      {
        flight: 'VY1266',
        origin: 'ARN',
        destination: 'BCN',
        duration: 12_900,
        cabin_class: 'economy',
        departure_date: '2019-02-22'
      }
    end

    include_examples 'GET /v1/flight_footprint'

    context 'when not providing correct attributes' do
      it 'returns 400 Bad Request when flight is missing' do
        get '/api/v1/flight_footprint', headers: auth_headers(blocket_api_key),
                                        params: request_params.except(:flight)

        expect(response).to have_http_status(:bad_request)
      end

      it 'returns 400 Bad Request when origin is missing' do
        get '/api/v1/flight_footprint', headers: auth_headers(blocket_api_key),
                                        params: request_params.except(:origin)

        expect(response).to have_http_status(:bad_request)
      end

      it 'returns 400 Bad Request when destination is missing' do
        get '/api/v1/flight_footprint', headers: auth_headers(blocket_api_key),
                                        params: request_params.except(:destination)

        expect(response).to have_http_status(:bad_request)
      end

      it 'responds with error type when parameters are missing' do
        get '/api/v1/flight_footprint', headers: auth_headers(blocket_api_key),
                                        params: request_params.except(:flight)

        expect(response.parsed_body['type']).to eq('invalid_request_error')
      end
    end
  end

  def auth_headers(username, password = nil)
    {
      'HTTP_AUTHORIZATION' => ActionController::HttpAuthentication::Basic.encode_credentials(username, password)
    }
  end
end
