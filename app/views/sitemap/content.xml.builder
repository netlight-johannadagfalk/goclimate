# frozen_string_literal: true

xml.instruct!(:xml, version: '1.0')
xml.tag!(
  'urlset',
  'xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
  'xmlns:xhtml': 'http://www.w3.org/1999/xhtml'
) do
  @all_urls.each do |url, helper|
    xml.url do
      xml.loc(url)
      xml.changefreq('daily')
      Region.all.each do |region|
        xml.tag!(
          'xhtml:link',
          rel: 'alternate',
          hreflang: region.logical_locale,
          href: polymorphic_url(helper, region: region)
        )
      end
    end
  end
end
