# frozen_string_literal: true

module Admin
  class DashboardController < AdminController
    def index
      offsetting_statistics = OffsettingStatistics.new
      @total_co2_consumed = offsetting_statistics.total_sold
      @sold_offsetting_per_month = offsetting_statistics.sold_offsetting_per_month.to_a.reverse.to_h
      @total_co2_bought = Project.total_co2e
      @total_sek_spent = Project.all.sum('cost_in_sek')
      @payouts_in_sek = (StripePayout.sum(:amount) / 100) + Invoice.sum(:amount_in_sek)
      @users_stats = UsersStatistics.new
      @missing_fortnox_ids = missing_fortnox_ids.join(', ')
    end

    private

    def missing_fortnox_ids
      first = 1001
      last = [Invoice.maximum('fortnox_id'), ClimateReportInvoice.maximum('fortnox_id')].max.to_i
      all_registered = Invoice.select('fortnox_id').map { |i| i.fortnox_id.to_i } +
                       ClimateReportInvoice.select('fortnox_id').map { |i| i.fortnox_id.to_i }
      (first..last).to_a - all_registered
    end
  end
end
