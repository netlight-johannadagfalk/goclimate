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
  LifestyleFootprintAverage.new(%w[AT], 13_140, 'Ivanova 2017 & Umweltsbundesamt 2007'),
  LifestyleFootprintAverage.new(%w[AU], 18_940, 'Ivanova 2015 & Umweltsbundesamt 2007'),
  LifestyleFootprintAverage.new(%w[BE], 13_830, 'Ivanova 2017 & Umweltsbundesamt 2007'),
  LifestyleFootprintAverage.new(%w[BG], 7_240, 'Ivanova 2017 & Umweltsbundesamt 2007'),
  LifestyleFootprintAverage.new(%w[CA], 15_740, 'Ivanova 2015 & Umweltsbundesamt 2007'),
  LifestyleFootprintAverage.new(%w[CY], 13_240, 'Ivanova 2017 & Umweltsbundesamt 2007'),
  LifestyleFootprintAverage.new(%w[CZ], 11_440, 'Ivanova 2017 & Umweltsbundesamt 2007'),
  LifestyleFootprintAverage.new(%w[DE], 11_170, 'Umweltsbundesamt 2020'),
  LifestyleFootprintAverage.new(%w[DK], 15_740, 'Ivanova 2017 & Umweltsbundesamt 2007'),
  LifestyleFootprintAverage.new(%w[EE], 13_440, 'Ivanova 2017 & Umweltsbundesamt 2007'),
  LifestyleFootprintAverage.new(%w[ES], 13_340, 'Ivanova 2017 & Umweltsbundesamt 2007'),
  LifestyleFootprintAverage.new(%w[FI], 16_440, 'Ivanova 2017 & Umweltsbundesamt 2007'),
  LifestyleFootprintAverage.new(%w[FR], 10_940, 'Ivanova 2017 & Umweltsbundesamt 2007'),
  LifestyleFootprintAverage.new(%w[GB], 16_440, 'Ivanova 2017 & Umweltsbundesamt 2007'),
  LifestyleFootprintAverage.new(%w[GR], 16_440, 'Ivanova 2017 & Umweltsbundesamt 2007'),
  LifestyleFootprintAverage.new(%w[HU], 5_540, 'Ivanova 2017 & Umweltsbundesamt 2007'),
  LifestyleFootprintAverage.new(%w[IE], 16_640, 'Ivanova 2017 & Umweltsbundesamt 2007'),
  LifestyleFootprintAverage.new(%w[IT], 11_840, 'Ivanova 2017 & Umweltsbundesamt 2007'),
  LifestyleFootprintAverage.new(%w[LT], 9_840, 'Ivanova 2017 & Umweltsbundesamt 2007'),
  LifestyleFootprintAverage.new(%w[LU], 23_140, 'Ivanova 2017 & Umweltsbundesamt 2007'),
  LifestyleFootprintAverage.new(%w[LV], 8_640, 'Ivanova 2017 & Umweltsbundesamt 2007'),
  LifestyleFootprintAverage.new(%w[MT], 12_640, 'Ivanova 2017 & Umweltsbundesamt 2007'),
  LifestyleFootprintAverage.new(%w[NO], 12_797, 'Ivanova 2015 & Ducky'),
  LifestyleFootprintAverage.new(%w[PL], 9_540, 'Ivanova 2017 & Umweltsbundesamt 2007'),
  LifestyleFootprintAverage.new(%w[PT], 10_040, 'Ivanova 2017 & Umweltsbundesamt 2007'),
  LifestyleFootprintAverage.new(%w[RO], 6_640, 'Ivanova 2017 & Umweltsbundesamt 2007'),
  LifestyleFootprintAverage.new(%w[SE], 9_060, 'Naturvårdsverket 2018 & Chalmers 2017'),
  LifestyleFootprintAverage.new(%w[SI], 14_740, 'Ivanova 2017 & Umweltsbundesamt 2007'),
  LifestyleFootprintAverage.new(%w[SK], 11_840, 'Ivanova 2017 & Umweltsbundesamt 2007'),
  LifestyleFootprintAverage.new(%w[US], 19_840, 'CoolClimate Network 2021')
].freeze

LifestyleFootprintAverage::COUNTRIES_AVAILABLE = LifestyleFootprintAverage::COUNTRIES.flat_map(&:countries)

LifestyleFootprintAverage::WORLD = LifestyleFootprintAverage.new(nil, 5_000, 'World Bank')
