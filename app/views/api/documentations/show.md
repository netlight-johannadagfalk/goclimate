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
- **401 Unauthorized:** API key provided was not valid.
- **500, 502, 503, 504:** Server errors on the GoClimateNeutral side. Only used
  in exceptional circumstances.

## Resources

### Flight Emissions

Calculates estimated emissions per passenger for flights.

#### Retrieving estimated emissions

Retrieve estimated emissions for one flight. If you need to calculate emissions
for a trip with multiple legs, retrieve the estimated emissions for each leg
and sum estimated emissions for each to create a total for the full trip.

> **🚧 PRE-RELEASE NOTE:** This endpoint currently always responds with estimated
> emissions of 1.0 tonne CO2eq regardless of input parameters. We will start
> doing actual calculations soon and continue to improve the accuracy of our
> algorithm over time.

**Endpoint:**

`GET /v1/flight_emissions`

**Request parameters:**

- **flight:** Flight number.
- **origin:** Origin airport IATA code.
- **destination:** Destination airport IATA code.
- **duration:** Flight duration. In seconds.

**Response attributes:**

- **estimated_emissions**: Estimated emissions per passenger. In tonnes CO2eq.
  Current precision is one decimal point.
- **details_url**: URL to a page with more details about the carbon emissions
  for this flight. Currently always the GoClimateNeutral home page, but this
  might change in the future.

#### Example

Request:

    $ curl https://api.goclimateneutral.org/v1/flight_emissions \
      -u YOUR_API_KEY: \
      -d flight=VY1266 \
      -d origin=ARN \
      -d destination=BCN \
      -d duration=12900 \
      -G

Response:

    {
      "estimated_emissions": 1.0,
      "details_url": "https://www.goclimateneutral.org/"
    }
