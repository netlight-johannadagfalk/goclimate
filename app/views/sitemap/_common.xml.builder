# frozen_string_literal: true

@locations.each do |location|
  xml.url do
    xml.loc(@base_url + location)
    xml.changefreq('daily')
  end
end
