# frozen_string_literal: true

module Admin
  class DashboardController < AdminController
    def index
      @offsetting_statistics = OffsettingStatistics.new
      @total_co2_bought = Project.total_co2e
      @total_co2_consumed = @offsetting_statistics.total_sold
      @total_sek_spent = Project.all.sum('cost_in_sek')
      @payouts_in_sek = (StripePayout.sum(:amount) / 100) + Invoice.sum(:amount_in_sek)
      @new_users = new_users
      @new_users_mean = number_users_mean(@new_users)
      @churned_users = churned_users
      @churned_users_mean = number_users_mean(@churned_users)
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

    def new_users
      User.order('date(created_at)').group('date(created_at)').count.transform_keys(&:to_s)
    end

    def churned_users
      User.where('subscription_end_at is not null')
          .order('date(subscription_end_at)')
          .group('date(subscription_end_at)')
          .count
          .transform_keys(&:to_s)
    end

    def number_users_mean(number_users)
      users_mean = {}
      (0..30).each do |i|
        date = (Time.now.to_date - i).to_s
        mean = 0
        (0..13).each do |j|
          mean += number_users[(date.to_date - j).to_s] if number_users[(date.to_date - j).to_s].present?
        end
        mean = BigDecimal(mean) / 14
        users_mean[date] = mean.round(1)
      end
      users_mean
    end
  end
end
