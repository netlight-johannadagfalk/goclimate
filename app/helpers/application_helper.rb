# frozen_string_literal: true

module ApplicationHelper
  def new_calculator_active?
    return @new_calculator_active unless @new_calculator_active.nil?

    active =
      if cookies[:new_calculator].present?
        cookies[:new_calculator] == '1'
      else
        rand(0..100) <= 5
      end

    active = params[:new_calculator] == '1' if params[:new_calculator].present?

    cookies[:new_calculator] = { value: active ? '1' : '0', expires: 30.days.from_now }

    @new_calculator_active = active
  end

  def price_string(amount, currency, options = {})
    Rails.logger.warn 'DEPRECATION: Use Money#to_s instead of ApplicationHelper#price_string'

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
    Rails.logger.warn 'DEPRECATION: Use GreenhouseGases#to_s instead of ApplicationHelper#co2e_string'

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
    Rails.logger.warn 'DEPRECATION: Use GreenhouseGases#to_s instead of ApplicationHelper#precise_co2e_string'

    GreenhouseGases.new(co2e).to_s
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
