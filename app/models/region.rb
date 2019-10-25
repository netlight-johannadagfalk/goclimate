# frozen_string_literal: true

Region = Struct.new(:name, :slug, :locale, :currency, :icon, :country_codes) do
  def self.all
    [Region::Europe, Region::Germany, Region::Sweden, Region::USA].freeze
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

Region::Europe = Region.new('Europe', nil, :en, Currency::EUR, 'eu').freeze
Region::Germany = Region.new('Deutschland', 'de', :de, Currency::EUR, 'de', %w[DE]).freeze
Region::Sweden = Region.new('Sverige', 'se', :sv, Currency::SEK, 'se', %w[SE]).freeze
Region::USA = Region.new('United States', 'us', :en, Currency::USD, 'us', %w[US]).freeze
