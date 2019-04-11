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

  def co2e_string(co2e)
    co2e_tonnes = BigDecimal(co2e) / 1000
    "#{co2e_tonnes.truncate(1).to_s('F')} ton koldioxid"
  end
end
