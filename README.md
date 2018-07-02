# What is this?

This is the code that runs [http://goclimateneutral.org](http://goclimateneutral.org)

# How do I set up my environment?

* Install Ruby. See `.ruby-version` for required version.
  * [https://www.ruby-lang.org/en/downloads/](https://www.ruby-lang.org/en/downloads/)
* Install Rails.
  * `gem install rails`
* Install Postgres.
  * `brew install postgresql` 
* Install project-specific gems.
  * `bundle install`  
* Init the DB.
  * `initdb db/goclimateneutral`
* Start Postgres.
  * `pg_ctl -D db/goclimateneutral -l logfile start`
* Create the DB's.
  * `createdb goclimateneutral`
  * `createdb goclimateneutral_test`
* Init the DB tables and seed required data.
  * `bin/rails db:migrate db:seed`
* Set environment variables.
  * Copy `.env.sample` to `.env` and add your keys to the file.

# How do I start the server locally?

* `bin/rails server`
* Surf to [http://localhost:3000](http://localhost:3000)

# Troubleshooting

## Reseting your database

If you need to reset your database:

* Clear lifestyle choices and projects and reset their pk sequences:

  ```ruby
  LifestyleChoice.delete_all
  ActiveRecord::Base.connection.reset_pk_sequence!('lifestyle_choices')
  Project.delete_all
  ActiveRecord::Base.connection.reset_pk_sequence!('projects')
  ```

* Re-run `bin/rails db:seed`
