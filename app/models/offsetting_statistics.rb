# frozen_string_literal: true

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

  def sold_offsetting_per_month
    results = exec_statistics_query(<<~SQL, 'month', 'Sold offsetting per month')
      WITH
      subscription_months AS (
        SELECT to_char(start_at, 'YYYY-MM') AS month, count(id) AS subscription_months_count, sum(co2e) AS subscription_months_co2e FROM subscription_months GROUP BY month
      ),
      gift_cards AS (
        SELECT to_char(paid_at, 'YYYY-MM') AS month, count(id) AS gift_cards_count, sum(co2e) AS gift_cards_co2e FROM gift_cards WHERE paid_at IS NOT NULL GROUP BY month
      ),
      flight_offsets AS (
        SELECT to_char(paid_at, 'YYYY-MM') AS month, count(id) AS flight_offsets_count, sum(co2e) AS flight_offsets_co2e FROM flight_offsets WHERE paid_at IS NOT NULL GROUP BY month
      ),
      invoices AS (
        SELECT to_char(created_at, 'YYYY-MM') AS month, count(id) AS invoices_count, sum(co2e) AS invoices_co2e FROM invoices GROUP BY month
      ),
      climate_report_invoices AS (
        SELECT to_char(created_at, 'YYYY-MM') AS month, count(id) AS climate_report_invoices_count, sum(co2e) AS climate_report_invoices_co2e FROM climate_report_invoices GROUP BY month
      )
      SELECT * FROM subscription_months
      FULL OUTER JOIN gift_cards USING (month)
      FULL OUTER JOIN flight_offsets USING (month)
      FULL OUTER JOIN invoices USING (month)
      FULL OUTER JOIN climate_report_invoices USING (month)
      ORDER BY month
    SQL

    map_to_all_months_between(results.keys.first, results.keys.last, results)
      .each { |_, fields| fields[:total_co2e] = calculate_total_co2e(fields) }
  end

  private

  def exec_statistics_query(sql, key_field, name)
    ActiveRecord::Base.connection.exec_query(sql, name).map do |row|
      [
        row.delete(key_field),
        row.map { |field, value| [field.to_sym, cast_value(field, value)] if value.present? }.compact.to_h
      ]
    end.to_h
  end

  def cast_value(field, value)
    return GreenhouseGases.new(value) if field.end_with?('_co2e')

    value
  end

  def map_to_all_months_between(start_month, end_month, month_hash)
    months_between(start_month, end_month).map { |month| [month, month_hash[month] || {}] }.to_h
  end

  def months_between(start_month, end_month)
    end_date = Date.parse("#{end_month}-01")
    date = Date.parse("#{start_month}-01")
    months = []
    while date <= end_date
      months << date.strftime('%Y-%m')
      date = date.next_month
    end
    months
  end

  def calculate_total_co2e(fields)
    fields.filter { |k, _| k.to_s.end_with?('_co2e') }.values.reduce(GreenhouseGases.new(0), :+)
  end
end
