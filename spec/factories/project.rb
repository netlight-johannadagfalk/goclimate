# frozen_string_literal: true

FactoryBot.define do
  factory :project do
    name { 'Test project' }
    short_description { 'Short description for project' }
    co2e { 1_000 }
    date_bought { Date.today }
    latitude { 59.33172 }
    longitude { 18.06695 }
    image_url { <<~URL.chomp }
      https://www.goclimate.com/blog/wp-content/uploads/2017/05/0000213_trang-palm-oil-wastewater-treatment-project-in-trang-province-thailand_550.jpeg
    URL
    blog_url { <<~URL.chomp }
      https://www.goclimate.com/blog/carbon-offset-investment-in-trang-palm-oil-wastewater-treatment-project/
    URL
  end
end
