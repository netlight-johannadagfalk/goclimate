# frozen_string_literal: true

class UsersStatistics
  def new_users
    @new_users ||= User.order('date(created_at)').group('date(created_at)').count.transform_keys(&:to_s)
  end

  def new_users_with_subscription
    @new_users_with_subscription ||=
      User.where('date(first_subscription_created_at) = date(created_at)')
          .order('date(created_at)')
          .group('date(created_at)')
          .count.transform_keys(&:to_s)
  end

  def new_users_without_subscription
    @new_users_without_subscription ||=
      User.where('first_subscription_created_at IS NULL OR date(first_subscription_created_at) > date(created_at)')
          .order('date(created_at)')
          .group('date(created_at)')
          .count.transform_keys(&:to_s)
  end

  def new_users_with_referral_code
    @new_users_with_referral_code ||=
      User.where('referred_from_id IS NOT NULL')
          .order('date(created_at)')
          .group('date(created_at)')
          .count.transform_keys(&:to_s)
  end

  def churned_users
    @churned_users ||=
      User.where('subscription_end_at IS NOT NULL')
          .order('date(subscription_end_at)')
          .group('date(subscription_end_at)')
          .count
          .transform_keys(&:to_s)
  end

  def new_users_mean
    @new_users_mean ||= number_users_mean(new_users)
  end

  def churned_users_mean
    @churned_users_mean ||= number_users_mean(churned_users)
  end

  private

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
