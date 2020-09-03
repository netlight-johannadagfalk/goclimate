# frozen_string_literal: true

xml.instruct!(:xml, version: '1.0')
xml.tag!(
  'sitemapindex',
  'xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
  'xmlns:xhtml': 'http://www.w3.org/1999/xhtml'
) do
  xml.sitemap do
    xml.loc("#{@base_url}sitemap_content.xml")
  end
  xml.sitemap do
    xml.loc("#{@base_url}blog/sitemap_index.xml")
  end
end
