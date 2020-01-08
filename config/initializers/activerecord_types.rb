# frozen_string_literal: true

ActiveSupport::Reloader.to_prepare do
  ActiveRecord::Type.register(:currency, CurrencyType)
  ActiveRecord::Type.register(:greenhouse_gases, GreenhouseGasesType)
end
