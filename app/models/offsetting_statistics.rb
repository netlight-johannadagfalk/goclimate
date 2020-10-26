# frozen_string_literal: true

# TODO: Refactor this to always use co2e fields of sold offsetting and return a
# combined summary of all products.
class OffsettingStatistics
  def total_sold
    return @total_sold if @total_sold.present?

    co2e = ActiveRecord::Base.connection.exec_query(<<~SQL, 'Total sold').first['sum']
      WITH offsetting AS (
        SELECT co2e FROM subscription_months
        UNION ALL
        SELECT co2e FROM gift_cards WHERE paid_at IS NOT NULL
        UNION ALL
        SELECT co2e FROM flight_offsets WHERE paid_at IS NOT NULL
        UNION ALL
        SELECT co2e FROM invoices
        UNION ALL
        SELECT co2e FROM climate_report_invoices
      )
      SELECT SUM(co2e) FROM offsetting
    SQL

    @total_sold = GreenhouseGases.new(co2e || 0)
  end

  def card_payments_co2e_per_month # rubocop:disable Metrics/MethodLength
    @card_payments_co2e_per_month ||= begin
      co2 = {}
      card_payments_per_month.each do |(month, currency), amount|
        sek_amount =
          case currency
          when 'usd'
            amount * GreenhouseGases::PRICE_FACTOR_USD
          when 'eur'
            amount * GreenhouseGases::PRICE_FACTOR_EUR
          when 'sek'
            amount
          end
        co2[month] = 0 if co2[month].nil?
        co2[month] += sek_amount / GreenhouseGases::CONSUMER_PRICE_PER_TONNE_SEK.amount
      end
      co2
    end
  end

  def invoices_co2e_per_month
    @invoices_co2e_per_month ||=
      Invoice
      .group("CONCAT((EXTRACT(YEAR FROM created_at)), '-', LPAD(EXTRACT(MONTH FROM created_at)::text, 2, '0'))")
      .sum('co2e')
  end

  def climate_report_invoices_co2e_per_month
    @climate_report_invoices_co2e_per_month ||=
      ClimateReportInvoice
      .group("CONCAT((EXTRACT(YEAR FROM created_at)), '-', LPAD(EXTRACT(MONTH FROM created_at)::text, 2, '0'))")
      .sum('co2e')
  end

  private

  def card_payments_per_month
    CardCharge
      .where(paid: true)
      .group("CONCAT((EXTRACT(YEAR FROM created_at)), '-', LPAD(EXTRACT(MONTH FROM created_at)::text, 2, '0'))")
      .group('currency')
      .order('2 DESC')
      .sum('amount / 100')
  end
end
