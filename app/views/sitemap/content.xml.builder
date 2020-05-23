# frozen_string_literal: true

xml.instruct!(:xml, version: '1.0')
xml.tag!('urlset', 'xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9') do
  xml << (render partial: 'sitemap/common', locations: @locations, base_url: @base_url)
end
