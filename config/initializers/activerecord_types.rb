# frozen_string_literal: true

ActiveSupport::Reloader.to_prepare do
  ActiveRecord::Type.register(:country, CountryType)
  ActiveRecord::Type.register(:currency, CurrencyType)
  ActiveRecord::Type.register(:greenhouse_gases, GreenhouseGasesType)
  ActiveRecord::Type.register(:region, RegionType)
end
