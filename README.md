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
* Init basic LifestyleChoice data
  * `bin/rails c`
  * in console mode, enter: 
```
LifestyleChoice.create!([
  {name: "vegan", category: "food", version: 1, co2: "0.59"},
  {name: "vegetarian", category: "food", version: 1, co2: "1.23"},
  {name: "mostly_vegetarian", category: "food", version: 1, co2: "1.8"},
  {name: "sometimes_vegetarian", category: "food", version: 1, co2: "2.0"},
  {name: "meat_eater", category: "food", version: 1, co2: "2.62"},
  {name: "no_car", category: "car", version: 1, co2: "0.0"},
  {name: "electric_car", category: "car", version: 1, co2: "0.0"},
  {name: "fuel_efficient_seldom_drives", category: "car", version: 1, co2: "0.156"},
  {name: "fuel_efficient_car_drives_often", category: "car", version: 1, co2: "0.624"},
  {name: "normal_car_seldom_drives", category: "car", version: 1, co2: "0.312"},
  {name: "normal_car_drives_often", category: "car", version: 1, co2: "1.248"},
  {name: "suv_seldom_drives", category: "car", version: 1, co2: "0.468"},
  {name: "suv_drives_often", category: "car", version: 1, co2: "1.872"},
  {name: "never_flies", category: "flying", version: 1, co2: "0.0"},
  {name: "flies_short_distance_1_time_year", category: "flying", version: 1, co2: "0.268"},
  {name: "flies_short_distance_2_time_year", category: "flying", version: 1, co2: "0.536"},
  {name: "flies_short_distance_3_time_year", category: "flying", version: 1, co2: "0.804"},
  {name: "flies_short_distance_6_time_year", category: "flying", version: 1, co2: "1.608"},
  {name: "flies_short_distance_12_time_year", category: "flying", version: 1, co2: "3.216"},
  {name: "flies_long_distance_1_time_year", category: "flying", version: 1, co2: "2.3"},
  {name: "flies_long_distance_2_time_year", category: "flying", version: 1, co2: "4.6"},
  {name: "flies_long_distance_3_time_year", category: "flying", version: 1, co2: "6.9"},
  {name: "flies_long_distance_6_time_year", category: "flying", version: 1, co2: "13.8"},
  {name: "flies_long_distance_12_time_year", category: "flying", version: 1, co2: "27.6"},
  {name: "hardly_ever_flies", category: "custom", version: 1, co2: "0.536"},
  {name: "flies_sometimes", category: "custom", version: 1, co2: "2.3"},
  {name: "base", category: "base", version: 1, co2: "4.0"}
])
```

# How do I start the server locally?

* `bin/rails server`
* Surf to [http://localhost:3000](http://localhost:3000)

