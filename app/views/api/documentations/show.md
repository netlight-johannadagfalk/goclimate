# GoClimateNeutral API Reference

## Introduction

The GoClimateNeutral API is organized around [REST][rest]. It has
resource-oriented URLs, accepts form-encoded request bodies, returns
[JSON-encoded][json] responses, and uses standard HTTP response codes,
authentication, and verbs.

[rest]: https://developer.mozilla.org/en-US/docs/Glossary/REST
[json]: http://www.json.org/

## Authentication

The GoClimateNeutral API uses API keys to authenticate requests. Get your API
key by [contacting us][contact].

Authentication to the API is performed via [HTTP Basic Auth][basic-auth].
Provide your API key as the basic auth username value and leave the password
empty. Authentication is required for all endpoints.

[contact]: https://www.goclimateneutral.org/contact
[basic-auth]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication

## Errors

GoClimateNeutral uses conventional HTTP status codes to indicate the success or
failure of API requests.

**Summary of HTTP status codes used by the GoClimateNeutral API:**

- **200 OK:** Request was successful.
- **404 Not Found:** The requested resource could not be found.
- **401 Unauthorized:** API key provided was not valid.
- **500, 502, 503, 504:** Server errors on the GoClimateNeutral side. Only used
  in exceptional circumstances.

## Resources

### Flight Footprint

Calculates estimated footprint per passenger for flights.

#### Retrieving flight footprint

Retrieve estimated footprint for one flight. If you need to calculate footprint
for a trip with multiple legs, retrieve the estimated footprint for each leg
and sum estimated footprint for each to create a total for the full trip.

**Endpoint:**

`GET /v1/flight_footprint`

**Request parameters:**

- Segments of the flight itenireary. For each parameter below, replace n with a unique identifier for each segment of the trip. These parameters are repeated for each segment.
  - **segments[n][flight]:** Flight designator code. 
  - **segments[n][origin]:** Origin airport IATA code.
  - **segments[n][destination]:** Destination airport IATA code.
  - _(DEPRECATED)_ **segments[n][duration]:** Flight duration. In seconds.
  - _(DEPRECATED)_ **segments[n][departure_date]:** Departure date. ISO 8601 date formatted.
- **cabin_class:** Cabin class. One of `economy`, `premium_economy`, `business`
  and `first`.
- **currencies[]:** Desired currencies for offset pricing. One of `EUR`, `USD`, `SEK` and `NOK`. You can request multiple currencies by including multiple items in the currencies array.
- _(DEPRECATED) **flight:** Flight designator code._
- _(DEPRECATED) **origin:** Origin airport IATA code._
- _(DEPRECATED) **destination:** Destination airport IATA code._
- _(DEPRECATED) **duration:** Flight duration. In seconds._
- _(DEPRECATED) **departure\_date:** Departure date. ISO 8601 date formatted._

**Response attributes:**

- **footprint**: Estimated footprint per passenger. In kgs CO2e.  Current
  precision is 100 kg. We recommend displaying this number in tonnes CO2e to the
  user.
- **offset_prices[]:** Array of objects representing prices per passenger for
  offsetting this flight through GoClimateNeutral. One object per currency
  requested.
  Currently returns non-final prices in SEK.
  - **amount**: Amount. In smallest denomination of currency indicated by
    **currency** (e.g. 1000 for 10.00 EUR).
  - **currency:** ISO 4217 currency code for amount specified by **amount**.
- **details_url**: URL to a page where the user can offset the flight.

**Errors:**

- **invalid\_request\_error - HTTP status 400**: Request parameters are missing
  or not valid.
- **calculation_unsuccessful - HTTP status 404:** We are currently not able to
  calculate an estimated footprint based on the given parameters. This is not a
  permanent state as we continuously work to improve coverage, although
  immediate retries are not likely to produce a different result.

#### Example

Request:

    $ curl https://api.goclimateneutral.org/v1/flight_footprint \
      -u YOUR_API_KEY: \
      -d 'segments[0][flight]=VY1266' \
      -d 'segments[0][origin]=ARN' \
      -d 'segments[0][destination]=BCN' \
      -d 'segments[1][flight]=VY1265' \
      -d 'segments[1][origin]=BCN' \
      -d 'segments[1][destination]=ARN' \
      -d 'cabin_class=economy' \
      -d 'currencies[]=SEK' \
      -G

Response:

    {
      "footprint": 1400,
      "offset_prices": [
        {
          "amount": 4000,
          "currency": "SEK"
        }
      ],
      "details_url": "https://www.goclimateneutral.org/flight_offsets/new?offset_params=economy%2CARN%2CBCN%2CBCN%2CARN"
    }
