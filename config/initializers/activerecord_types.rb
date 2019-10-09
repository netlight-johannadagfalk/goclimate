# frozen_string_literal: true

ActiveSupport::Reloader.to_prepare do
  ActiveRecord::Type.register(:currency, CurrencyType)
end
