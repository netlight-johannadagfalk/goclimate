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

> **🚧 PRE-RELEASE NOTE:** This endpoint currently always responds with an
> estimated footprint of 1.0 tonne CO2eq regardless of input parameters. We
> will start doing actual calculations soon and continue to improve the
> accuracy of our algorithm over time.

**Endpoint:**

`GET /v1/flight_footprint`

**Request parameters:**

- **flight:** Flight designator code.
- **origin:** Origin airport IATA code.
- **destination:** Destination airport IATA code.
- **duration:** Flight duration. In seconds.
- **cabin_class:** Cabin class. One of `economy`, `premium_economy`, `business`
  and `first`.
- **departure_date:** Departure date. ISO 8601 date formatted.

**Response attributes:**

- **footprint**: Estimated footprint per passenger. In tonnes CO2eq.
  Current precision is one decimal point.
- **details_url**: URL to a page with more details about the carbon footprint
  for this flight. Currently always the GoClimateNeutral home page, but this
  might change in the future.

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
      -d flight=VY1266 \
      -d origin=ARN \
      -d destination=BCN \
      -d duration=12900 \
      -d cabinClass=economy \
      -d departureDate=2019-02-22 \
      -G

Response:

    {
      "footprint": 1.0,
      "details_url": "https://www.goclimateneutral.org/"
    }
