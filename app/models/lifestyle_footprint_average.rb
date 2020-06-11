# frozen_string_literal: true

LifestyleFootprintAverage = Struct.new(:countries, :co2e, :source) do
  def initialize(countries, co2e, source)
    super(
      countries&.map { |code| ISO3166::Country.new(code) },
      GreenhouseGases.new(co2e),
      source
    )
  end

  def self.find_by_country(country)
    LifestyleFootprintAverage::COUNTRIES.find { |a| a.countries.include?(country) } ||
      LifestyleFootprintAverage::WORLD
  end
end

LifestyleFootprintAverage::COUNTRIES = [
  LifestyleFootprintAverage.new(%w[AT], 11_800, 'Ivanova 2015'),
  LifestyleFootprintAverage.new(%w[AU], 18_360, 'AustralianEthical 2020/Global Footprint Network 2018'),
  LifestyleFootprintAverage.new(%w[BE], 12_500, 'Ivanova 2015'),
  LifestyleFootprintAverage.new(%w[BG], 6_000, 'Ivanova 2015'),
  LifestyleFootprintAverage.new(%w[CA], 15_160, 'The World Bank: Data (production based)'),
  LifestyleFootprintAverage.new(%w[CY], 12_100, 'Ivanova 2015'),
  LifestyleFootprintAverage.new(%w[CZ], 10_200, 'Ivanova 2015'),
  LifestyleFootprintAverage.new(%w[DE], 13_000, 'Ivanova 2015'),
  LifestyleFootprintAverage.new(%w[DK], 14_500, 'Ivanova 2015'),
  LifestyleFootprintAverage.new(%w[EE], 12_200, 'Ivanova 2015'),
  LifestyleFootprintAverage.new(%w[ES], 11_100, 'Ivanova 2015'),
  LifestyleFootprintAverage.new(%w[FI], 15_200, 'Ivanova 2015'),
  LifestyleFootprintAverage.new(%w[FR], 9_700, 'Ivanova 2015'),
  LifestyleFootprintAverage.new(%w[GB], 15_300, 'Ivanova 2015'),
  LifestyleFootprintAverage.new(%w[GR], 14_600, 'Ivanova 2015'),
  LifestyleFootprintAverage.new(%w[HU], 6_400, 'Ivanova 2015'),
  LifestyleFootprintAverage.new(%w[IE], 15_200, 'Ivanova 2015'),
  LifestyleFootprintAverage.new(%w[IT], 10_600, 'Ivanova 2015'),
  LifestyleFootprintAverage.new(%w[LT], 8_600, 'Ivanova 2015'),
  LifestyleFootprintAverage.new(%w[LU], 22_000, 'Ivanova 2015'),
  LifestyleFootprintAverage.new(%w[LV], 7_300, 'Ivanova 2015'),
  LifestyleFootprintAverage.new(%w[MT], 11_300, 'Ivanova 2015'),
  LifestyleFootprintAverage.new(%w[PL], 8_300, 'Ivanova 2015'),
  LifestyleFootprintAverage.new(%w[PT], 8_600, 'Ivanova 2015'),
  LifestyleFootprintAverage.new(%w[RO], 5_400, 'Ivanova 2015'),
  LifestyleFootprintAverage.new(%w[SE], 8_870, 'Naturvårdsverket'),
  LifestyleFootprintAverage.new(%w[SI], 13_500, 'Ivanova 2015'),
  LifestyleFootprintAverage.new(%w[SK], 10_600, 'Ivanova 2015'),
  LifestyleFootprintAverage.new(%w[US], 19_200, 'CoolClimate Network')
].freeze

LifestyleFootprintAverage::WORLD = LifestyleFootprintAverage.new(nil, 5_000, 'World Bank')
