FactoryBot.define do
  factory :action do
    id { "" }
    name { "MyString" }
    description { "MyString" }
    points { 1 }
    status { "MyString" }
    repeatable { false }
    action_of_the_month { false }
  end
end
