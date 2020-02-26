# GoClimateNeutral

[![Maintainability](https://api.codeclimate.com/v1/badges/711e900ab6fb4c385a19/maintainability)](https://codeclimate.com/repos/5c99da9af52fd70240006af8/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/711e900ab6fb4c385a19/test_coverage)](https://codeclimate.com/repos/5c99da9af52fd70240006af8/test_coverage) [![View performance data on Skylight](https://badges.skylight.io/typical/zdRSFyrfwutu.svg?token=94hHNP2Fy3Obgt0c3MoiPXDLiIW1E9axYM5e-vN-occ)](https://www.skylight.io/app/applications/zdRSFyrfwutu) [![View performance data on Skylight](https://badges.skylight.io/problem/zdRSFyrfwutu.svg?token=94hHNP2Fy3Obgt0c3MoiPXDLiIW1E9axYM5e-vN-occ)](https://www.skylight.io/app/applications/zdRSFyrfwutu)

This is the code that runs [http://goclimateneutral.org](http://goclimateneutral.org)

## What the app does

GoClimateNeutral makes it easy for everyone to take meaningful action for the
climate. Read more about the goals & vision at [our DNA page on
Notion](https://www.notion.so/goclimateneutral/DNA-f97c8cd8d8ea4640bc2a8f9af19e4bd0).
See also strategy & current focus areas on [the Big Picture board on
Trello](https://trello.com/b/2MQUzhNh/big-picture).

## The domain & models

Our domain consists of:

- Calculators to understand one's footprint in different areas.
- Carbon offset products fit for different use cases.
- Accounts & other supporting models.

### Core concepts

| Model                 | Description                                         |
| ----------------------|-----------------------------------------------------|
| Greenhouse gases      | An amount of greenhouse gases, either estimated emissions or offset amount. We use the term `co2e` and always store this in kg's |
| `Project`             | A carbon offsetting project. These are the credits we sell through our products. |
| Money                 | An amount and a currency. Amounts are stored and processed as smallest units (cents/öres). |
| Region                | A named region with a combination of language and currency. Each region corresponds to their own base URL for SEO reasons. (Not yet implemented.) |

### Calculators

| Model                 | Description                                         |
| ----------------------|-----------------------------------------------------|
| `LifestyleChoice`     | Footprint for an individuals full lifestyle.        |
| `GenericFlightFootprint` | Footprint for flight iteniraries.                |
| (Gift cards)          | (Done inline in `GiftCard`.)                        |
| (Service companies)   | (Done inline in `ClimateReportCalculation`.)        |

### Products

| Model                 | Description                                         |
| ----------------------|-----------------------------------------------------|
| Subscription & related payments (in Stripe) | Monthly subscription for continuously offseting an individuals full lifestyle footprint. |
| `GiftCard`            | A sold gift card.                                   |
| `FlightOffset`        | A sold flight offset.                               |
| `ClimateReportInvoice` | Sold offsetting for a climate report done by a service company. |
| `Invoice`             | Sold offsetting for ad-hoc agreements.              |

### Supporting

| Model                 | Description                                         |
| ----------------------|-----------------------------------------------------|
| `User`                | A registered user. Account creation is currently only possible by signing up for a subscription, but you can cancel and still keep the account. |
| `CardCharge`          | Charges for purchases of an offset product.         |

## Coding guidelines

We follow these principles:

- Start by asking yourself how the problem can be solved without code. Only
  write the code that is necessary.
- Break solutions into small, self-contained increments. This minimizes risk
  and makes it easier for us to reason about changes as a team.
- Write solutions that use no or well-established tools & libraries.  Fewer &
  more stable dependencies reduce our exposure for maintainence costs.
- Push domain logic to models and keep views, controllers, etc as lean as
  possible.
- Aim for good test coverage of domain logic. Keep integration tests focused on
  the happy path.
- Start out with specific implementations, naming, etc and make abstractions
  later. When in doubt, make abstractions when you encounter a third use case,
  not before.
- Optimize logic for readability by making it as straightforward and simple as
  possible. Code will be written once but read multiple times, so it's worth
  spending time to make the implementation simple and easy to understand.

### Commits

Commit often & [write well-formed commit messages that explain why, not
what](https://chris.beams.io/posts/git-commit/).

### Code

Follow linter config (open a PR with rule changes if you disagree) and write
tests according to [Better Specs](http://www.betterspecs.org).

## Contributing

Work is primarily focused on reaching outcomes of the theme we currently
focus on. See [Produktutveckling on Trello](https://trello.com/b/7PE8N0si).

If you have slack time or need a break, pick any tech story from issues here
on GitHub, or pick up something from [Produktidéer on
Trello](https://trello.com/b/oNCHkN2R). Remember to always keep
non-prioritied work isolated and without introducing maintenance costs.

### Pull Requests

Open a Pull Request and ask for a review from at least one other person. After
review, merge your own code and make sure it deploys well. We tend to do
regular merges as opposed to rebase/squashes to keep history intact.

### Reporting issues & feature ideas

- Report technical debt and refactorings as issues here on GitHub.
- Product ideas go to [Produktidéer on Trello](https://trello.com/b/oNCHkN2R).

Keep in mind that none of these are "backlogs" in the traditional sense (we
have no backlogs). We only commit to work when we're about to start it and
always select freely from all ideas based on what outcome we currently focus on.

## Requirements

* Ruby and bundler (see `.ruby-version`)
* PostgreSQL
* Firefox and geckodriver

## Getting started

* Install dependencies. 
  * [Install Ruby](https://www.ruby-lang.org/en/documentation/installation/).
    See `.ruby-version` for required version.
  * `gem install bundler`
    * Note that this will also install native dependency `wkhtmltopdf` (a binary needed for PDF generation). See Gemfile.
  * `brew install postgresql geckodriver` 
  * [Get Firefox](https://www.mozilla.org/en-US/firefox/)
* Setup the database
  * `initdb db/goclimateneutral`
  * `pg_ctl -D db/goclimateneutral -l logfile start`
* Set environment variables.
  * Copy `.env.sample` to `.env` and add your keys to the file. You will at least need to set the 2 keys for Stripe to get the tests passing.
* Run the setup command that installs project-specific dependencies.
  * `bin/setup`

## Developing

* Run the development server: `bin/rails server`
* If you're doing front-end work, Webpack dev server gives you hot realoding of JS & CSS: `bin/yarn dev`
* Watch for updates and continuosly run relevant specs & linters: `bin/guard`
* Run Ruby tests: `bin/rspec`
* Run Ruby linter: `bin/rubocop`

## Troubleshooting

### Reseting your database

If you need to reset your database:

* Clear lifestyle choices and projects and reset their pk sequences:

  ```ruby
  LifestyleChoice.delete_all
  ActiveRecord::Base.connection.reset_pk_sequence!('lifestyle_choices')
  Project.delete_all
  ActiveRecord::Base.connection.reset_pk_sequence!('projects')
  ```

* Re-run `bin/rails db:seed`

### Stopping a hung development server

* `lsof -i :3000`
* Kill the process
