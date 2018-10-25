# frozen_string_literal: true

module ApplicationHelper
  def price_string(amount, currency)
    case currency
    when 'sek'
      "#{amount / 100} kr"
    when 'eur'
      "#{amount / 100} €"
    when 'usd'
      "$#{amount / 100}"
    end
  end
end
