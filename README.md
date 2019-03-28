# GoClimateNeutral

[![Maintainability](https://api.codeclimate.com/v1/badges/711e900ab6fb4c385a19/maintainability)](https://codeclimate.com/repos/5c99da9af52fd70240006af8/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/711e900ab6fb4c385a19/test_coverage)](https://codeclimate.com/repos/5c99da9af52fd70240006af8/test_coverage) [![View performance data on Skylight](https://badges.skylight.io/typical/zdRSFyrfwutu.svg?token=94hHNP2Fy3Obgt0c3MoiPXDLiIW1E9axYM5e-vN-occ)](https://www.skylight.io/app/applications/zdRSFyrfwutu) [![View performance data on Skylight](https://badges.skylight.io/problem/zdRSFyrfwutu.svg?token=94hHNP2Fy3Obgt0c3MoiPXDLiIW1E9axYM5e-vN-occ)](https://www.skylight.io/app/applications/zdRSFyrfwutu)

This is the code that runs [http://goclimateneutral.org](http://goclimateneutral.org)

## Requirements

* Ruby and bundler
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
* Install project-specific gems.
  * `bundle install`  
* Setup the database
  * `initdb db/goclimateneutral`
  * `pg_ctl -D db/goclimateneutral -l logfile start`
  * `bin/rails db:setup db:seed`
* Set environment variables.
  * Copy `.env.sample` to `.env` and add your keys to the file.

## Running tests

* Watch for updates and continuosly run relevant specs: `bin/guard`
* To run just once: `bin/rspec`

## Running the development server

* `bin/rails server`
* Surf to [http://localhost:3000](http://localhost:3000)

## Stopping the development server

* `lsof -i :3000`
* Kill the process

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
