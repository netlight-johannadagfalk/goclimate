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
    co2e_string = co2e_tonnes.truncate(co2e_tonnes < 0.1 ? 2 : 1).to_s('F')

    if options[:omit_unit] == true
      co2e_string
    else
      case I18n.locale
      when :sv
        "#{co2e_string} ton koldioxid"
      else
        "#{co2e_string} tonnes CO2e"
      end
    end
  end

  def precise_co2e_string(co2e)
    if co2e % 1000 == 0
      I18n.translate('helpers.application.precise_co2e_string_tonnes', tonnes: co2e / 1000)
    else
      I18n.translate('helpers.application.precise_co2e_string_kg', co2e: co2e)
    end
  end

  def url_for_region(region, options = {})
    return root_url(region: region, **options) unless request.get?

    url_for(request.query_parameters.merge(region: region, **options))
  end

  private

  def fractional_string(amount)
    fractional_amount = BigDecimal(amount) / 100

    if fractional_amount.frac == 0
      number_with_precision(fractional_amount, delimiter: ' ', precision: 0)
    else
      number_with_precision(fractional_amount, delimiter: ' ', precision: 2, separator: ':')
    end
  end
end
