# frozen_string_literal: true

Region = Struct.new(:slug, :locale, :currency, :icon) do
  def self.all
    [Region::Europe, Region::Germany, Region::Sweden, Region::USA].freeze
  end

  def self.from_slug(slug)
    all.find { |region| region.slug == slug }
  end

  def to_param
    slug
  end
end

Region::Europe = Region.new(nil, :en, Currency::EUR, 'eu').freeze
Region::Germany = Region.new('de', :de, Currency::EUR, 'de').freeze
Region::Sweden = Region.new('se', :sv, Currency::SEK, 'se').freeze
Region::USA = Region.new('us', :en, Currency::USD, 'us').freeze
