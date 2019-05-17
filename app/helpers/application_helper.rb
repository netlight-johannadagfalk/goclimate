# frozen_string_literal: true

module ApplicationHelper
  def price_string(amount, currency, options = {})
    lowest_denominator = options.delete(:lowest_denominator) || false

    case currency
    when 'sek'
      if lowest_denominator
        "#{fractional_string(amount)} kr"
      else
        "#{amount} kr"
      end
    when 'eur'
      "#{amount} €"
    when 'usd'
      "$#{amount}"
    end
  end

  def co2e_string(co2e, options = {})
    co2e_tonnes = BigDecimal(co2e) / 1000
    co2e_string = co2e_tonnes.truncate(1).to_s('F')

    if options[:omit_unit] == true
      co2e_string
    else
      "#{co2e_string} ton koldioxid"
    end
  end

  private

  def fractional_string(amount)
    fractional_amount = BigDecimal(amount) / 100

    if fractional_amount.frac == 0
      number_with_precision(fractional_amount, precision: 0)
    else
      number_with_precision(fractional_amount, precision: 2, separator: ':')
    end
  end
end
