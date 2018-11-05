# frozen_string_literal: true

module ApplicationHelper
  def price_string(amount, currency)
    case currency
    when 'sek'
      "#{amount} kr"
    when 'eur'
      "#{amount} €"
    when 'usd'
      "$#{amount}"
    end
  end
end
