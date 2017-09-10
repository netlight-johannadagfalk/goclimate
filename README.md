# What is this?

This is the code that runs [http://goclimateneutral.org](http://goclimateneutral.org)

# How do I set up my environment?

* Install Ruby
  * [https://www.ruby-lang.org/en/downloads/](https://www.ruby-lang.org/en/downloads/)
* Install Rails
  * `gem install rails`
* Install Postgres
  * `brew install pg` 
* Install project-specific gems
  * `bundle install`  
* Create the DB
  * `initdb db/goclimateneutral`
* Start Postgres
  * `pg_ctl -D db/goclimateneutral -l logfile start`
* Init the DB tables
  * `bin/rails db:migrate RAILS_ENV=development`  

# How do I start the server locally?

* `bin/rails server`
* Surf to [http://localhost:3000](http://localhost:3000)

