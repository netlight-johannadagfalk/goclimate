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
          destination: 'BCN',
          duration: 12_900,
          departure_date: '2019-02-22'
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
        destination: 'ARN',
        duration: 12_900,
        departure_date: '2019-02-25'
      } }
    )
  end

  shared_examples 'GET /v1/flight_footprint' do
    it 'returns 200 OK for successful requests' do
      get '/api/v1/flight_footprint', headers: auth_headers(blocket_api_key), params: request_params

      expect(response).to have_http_status(:ok)
    end

    it 'includes estimated footprint in response (200 kg per flight hour, rounded to nearest 0.1 tonnes)' do
      get '/api/v1/flight_footprint', headers: auth_headers(blocket_api_key), params: request_params

      expect(response.parsed_body['footprint']).to eq(700)
    end

    it 'includes offset price in response' do
      get '/api/v1/flight_footprint', headers: auth_headers(blocket_api_key), params: request_params

      expect(response.parsed_body['offset_prices'].first).to be_present
    end

    it 'includes offset price amount in response' do
      get '/api/v1/flight_footprint', headers: auth_headers(blocket_api_key), params: request_params

      expect(response.parsed_body['offset_prices'].first['amount']).to eq(2800)
    end

    it 'includes offset price currency in response' do
      get '/api/v1/flight_footprint', headers: auth_headers(blocket_api_key), params: request_params

      expect(response.parsed_body['offset_prices'].first['currency']).to eq('SEK')
    end

    it 'includes details URL in response' do
      get '/api/v1/flight_footprint', headers: auth_headers(blocket_api_key), params: request_params

      expect(response.parsed_body['details_url']).to end_with('/flight_offsets/new?offset_params=economy%2CARN%2CBCN')
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

    it 'includes estimated footprint in response (another example)' do
      get '/api/v1/flight_footprint', headers: auth_headers(blocket_api_key),
                                      params: request_params.deep_merge(segments: { '0': { duration: 15_840 } })

      expect(response.parsed_body['footprint']).to eq(900)
    end

    it 'sums estimated footprint for each segment' do
      get '/api/v1/flight_footprint', headers: auth_headers(blocket_api_key),
                                      params: request_params_with_two_segments

      expect(response.parsed_body['footprint']).to eq(1400)
    end

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

      it 'returns 400 Bad Request when duration is missing' do
        get '/api/v1/flight_footprint', headers: auth_headers(blocket_api_key),
                                        params: request_params.deep_merge(segments: { '0': { duration: nil } })

        expect(response).to have_http_status(:bad_request)
      end

      it 'returns 400 Bad Request when destination is missing' do
        get '/api/v1/flight_footprint', headers: auth_headers(blocket_api_key),
                                        params: request_params.deep_merge(segments: { '0': { destination: nil } })

        expect(response).to have_http_status(:bad_request)
      end

      it 'returns 400 Bad Request when departure date is missing' do
        get '/api/v1/flight_footprint', headers: auth_headers(blocket_api_key),
                                        params: request_params.deep_merge(segments: { '0': { departure_date: nil } })

        expect(response).to have_http_status(:bad_request)
      end

      it 'returns 400 Bad Request when departure date is not an ISO 8601 string' do
        get '/api/v1/flight_footprint', headers: auth_headers(blocket_api_key),
                                        params: request_params.deep_merge(
                                          segments: { '0': { departure_date: '0508-2019' } }
                                        )

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

    it 'includes estimated footprint in response (another example)' do
      get '/api/v1/flight_footprint', headers: auth_headers(blocket_api_key),
                                      params: request_params.merge(duration: 15_840)

      expect(response.parsed_body['footprint']).to eq(900)
    end

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

      it 'returns 400 Bad Request when duration is missing' do
        get '/api/v1/flight_footprint', headers: auth_headers(blocket_api_key),
                                        params: request_params.except(:duration)

        expect(response).to have_http_status(:bad_request)
      end

      it 'returns 400 Bad Request when destination is missing' do
        get '/api/v1/flight_footprint', headers: auth_headers(blocket_api_key),
                                        params: request_params.except(:destination)

        expect(response).to have_http_status(:bad_request)
      end

      it 'returns 400 Bad Request when departure date is missing' do
        get '/api/v1/flight_footprint', headers: auth_headers(blocket_api_key),
                                        params: request_params.except(:departure_date)

        expect(response).to have_http_status(:bad_request)
      end

      it 'returns 400 Bad Request when departure date is not an ISO 8601 string' do
        get '/api/v1/flight_footprint', headers: auth_headers(blocket_api_key),
                                        params: request_params.merge(departure_date: '0508-2019')

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
