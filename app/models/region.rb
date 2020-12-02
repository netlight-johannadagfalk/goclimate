# frozen_string_literal: true

Region = Struct.new(:id, :name, :slug, :locale, :logical_locale, :currency, :country_codes) do
  def self.all
    Region::ALL
  end

  def self.find(id)
    all.find { |region| region.id == id }
  end

  def self.from_slug(slug)
    all.find { |region| region.slug == slug }
  end

  def self.recommended_for_ip_country(country_code)
    return nil unless country_code.present?

    all.find { |region| region.country_codes&.include?(country_code) } || Region::Europe
  end

  def to_param
    slug
  end
end

Region::ALL = [
  Region::Australia = Region.new('au', 'Australia', 'au', :en, 'en-AU', Currency::AUD, %w[AU]).freeze,
  Region::Canada = Region.new('ca', 'Canada', 'ca', :en, 'en-CA', Currency::CAD, %w[CA]).freeze,
  Region::Denmark = Region.new('dk', 'Danmark', 'dk', :en, 'dk-DK', Currency::DKK, %w[DK]).freeze,
  Region::Europe = Region.new('eu', 'Europe', nil, :en, 'en', Currency::EUR).freeze,
  Region::Germany = Region.new('de', 'Deutschland', 'de', :de, 'de-DE', Currency::EUR, %w[DE]).freeze,
  Region::Sweden = Region.new('se', 'Sverige', 'se', :sv, 'sv-SE', Currency::SEK, %w[SE]).freeze,
  Region::UK = Region.new('gb', 'United Kingdom', 'gb', :en, 'en-GB', Currency::GBP, %w[GB]).freeze,
  Region::USA = Region.new('us', 'United States', 'us', :en, 'en-US', Currency::USD, %w[US]).freeze
].freeze
