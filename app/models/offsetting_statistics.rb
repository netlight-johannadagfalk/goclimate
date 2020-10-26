# frozen_string_literal: true

# TODO: Refactor this to always use co2e fields of sold offsetting and return a
# combined summary of all products.
class OffsettingStatistics
  def total_sold
    @total_sold ||= begin
      cdm_project_cost = Project.where("offset_type = 'CDM'").sum('cost_in_sek')
      cdm_project_tonnes = Project.where("offset_type = 'CDM'").sum('co2e') / 1000
      user_offset = (
        (total_card_payments_in_sek - cdm_project_cost) /
        GreenhouseGases::CONSUMER_PRICE_PER_TONNE_SEK.amount.to_i
      ).round + cdm_project_tonnes

      user_offset + (BigDecimal(ClimateReportInvoice.sum(:co2e) + Invoice.sum(:co2e)) / 1000).ceil
    end
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

  def total_card_payments_in_sek
    (total_card_payments_sek_part +
      total_card_payments_usd_part * GreenhouseGases::PRICE_FACTOR_USD +
      total_card_payments_eur_part * GreenhouseGases::PRICE_FACTOR_EUR).round
  end

  def total_card_payments_usd_part
    CardCharge.where(paid: true).where(currency: 'usd').sum('amount').to_i / 100
  end

  def total_card_payments_sek_part
    CardCharge.where(paid: true).where(currency: 'sek').sum('amount').to_i / 100
  end

  def total_card_payments_eur_part
    CardCharge.where(paid: true).where(currency: 'eur').sum('amount').to_i / 100
  end

  def card_payments_per_month
    CardCharge
      .where(paid: true)
      .group("CONCAT((EXTRACT(YEAR FROM created_at)), '-', LPAD(EXTRACT(MONTH FROM created_at)::text, 2, '0'))")
      .group('currency')
      .order('2 DESC')
      .sum('amount / 100')
  end
end
