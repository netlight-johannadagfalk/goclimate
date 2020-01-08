# frozen_string_literal: true

FactoryBot.define do
  factory :project do
    name { 'Test project' }
    co2e { 1_000 }
    date_bought { Date.today }
    longitude { 59.3317206 }
    latitude { 18.0669586 }
    image_url { <<~URL.chomp }
      https://www.goclimateneutral.org/blog/wp-content/uploads/2017/05/0000213_trang-palm-oil-wastewater-treatment-project-in-trang-province-thailand_550.jpeg
    URL
    blog_url { <<~URL.chomp }
      https://www.goclimateneutral.org/blog/carbon-offset-investment-in-trang-palm-oil-wastewater-treatment-project/
    URL
  end
end
