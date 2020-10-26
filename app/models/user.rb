# frozen_string_literal: true

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :trackable, :validatable

  has_many :card_charges, primary_key: 'stripe_customer_id', foreign_key: 'stripe_customer_id'
  has_many :lifestyle_footprints

  scope :with_active_subscription, lambda {
    where(subscription_end_at: nil).or(where('subscription_end_at >= ?', Time.now))
  }

  validates :user_name, format: { without: /.+@.+\..+/ }, allow_blank: true

  attribute :region, :region

  # accessor and validator of :privacy_policy are only here for client side validation via the ClientSideValidations gem
  validates :privacy_policy, acceptance: true
  attr_accessor :privacy_policy

  def stripe_customer
    Stripe::Customer.retrieve(stripe_customer_id) if stripe_customer_id.present?
  end

  def subscription_amount
    stripe_customer.subscriptions.first.plan.amount.to_f / 100
  end

  def subscription_amount_in_sek
    case Currency.from_iso_code(stripe_customer.subscriptions.first.plan.currency)
    when Currency::USD
      subscription_amount * GreenhouseGases::PRICE_FACTOR_USD
    when Currency::EUR
      subscription_amount * GreenhouseGases::PRICE_FACTOR_EUR
    else
      subscription_amount
    end
  end

  def country_name
    if !country.nil? && !country.empty?
      c = ISO3166::Country[country]
      c.translations[I18n.locale.to_s] || country.name
    else
      'Unknown'
    end
  end

  def number_of_neutral_months
    # TODO: Count SubscriptionMonths instead
    @number_of_neutral_months ||= card_charges.for_subscriptions.paid.count || 1
  end

  def total_subscription_offsetting
    # TODO: Sum SubscriptionMonth.co2e instead of calculating from money
    @total_subscription_offsetting ||=
      (my_amount_invested_sek / GreenhouseGases::CONSUMER_PRICE_PER_TONNE_SEK.amount.to_f).round(1)
  end

  def currency
    card_charges.first.currency
  end

  def update_without_password(params, *options)
    if params[:password].blank?
      params.delete(:password)
      params.delete(:password_confirmation) if params[:password_confirmation].blank?
    end

    result = update_attributes(params, *options)
    clean_up_passwords
    result
  end

  def update_from_stripe_subscription(stripe_subscription)
    self.subscription_end_at = subscription_end_at_from_stripe(stripe_subscription)
    save
  end

  def current_lifestyle_footprint
    lifestyle_footprints.order(:created_at).last
  end

  def free_account?
    return true unless stripe_customer&.subscriptions&.any?

    false
  end

  private

  def my_amount_invested_sek
    (
      my_amount_invested_sek_part +
      my_amount_invested_usd_part * GreenhouseGases::PRICE_FACTOR_USD +
      my_amount_invested_eur_part * GreenhouseGases::PRICE_FACTOR_EUR
    ).round
  end

  def my_amount_invested_sek_part
    card_charges.for_subscriptions.paid.in_sek.sum('amount').to_i / 100
  end

  def my_amount_invested_usd_part
    card_charges.for_subscriptions.paid.in_usd.sum('amount').to_i / 100
  end

  def my_amount_invested_eur_part
    card_charges.for_subscriptions.paid.in_eur.sum('amount').to_i / 100
  end

  def subscription_end_at_from_stripe(stripe_subscription)
    Time.at(stripe_subscription.ended_at) if stripe_subscription.ended_at.present?
  end
end
