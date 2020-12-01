# frozen_string_literal: true

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :trackable, :validatable

  has_many :card_charges, primary_key: 'stripe_customer_id', foreign_key: 'stripe_customer_id'
  has_many :lifestyle_footprints
  has_many :subscription_months
  belongs_to :referred_from, class_name: 'ReferralCode', optional: true

  validates :user_name, format: { without: /.+@.+\..+/ }, allow_blank: true

  attribute :region, :region

  # accessor and validator of :privacy_policy are only here for client side validation via the ClientSideValidations gem
  validates :privacy_policy, acceptance: true
  attr_accessor :privacy_policy

  def stripe_customer
    @stripe_customer ||=
      if stripe_customer_id.present?
        Stripe::Customer.retrieve(stripe_customer_id)
      else
        create_stripe_customer
      end
  end

  def create_stripe_customer
    Stripe::Customer.create(email: email).tap do |c|
      update_attribute(:stripe_customer_id, c.id)
    end
  end

  def subscription_amount
    stripe_customer.subscriptions.first.plan.amount.to_f / 100
  end

  def subscription_amount_in_sek
    subscription_currency = Currency.from_iso_code(stripe_customer.subscriptions.first.plan.currency)
    sek_price = GreenhouseGases::CONSUMER_PRICE_PER_TONNE[Currency::SEK]
    subscription_currency_price = GreenhouseGases::CONSUMER_PRICE_PER_TONNE[subscription_currency]

    ((sek_price.subunit_amount.to_d / subscription_currency_price.subunit_amount) * subscription_amount).to_i
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
    @number_of_neutral_months ||=
      begin
        months = subscription_months.count
        if months == 0 && active_subscription?
          1
        else
          months
        end
      end
  end

  def total_subscription_offsetting
    @total_subscription_offsetting ||= GreenhouseGases.new(subscription_months.sum(:co2e))
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

  def active_subscription?
    stripe_customer.subscriptions&.any?
  end

  private

  def subscription_end_at_from_stripe(stripe_subscription)
    Time.at(stripe_subscription.ended_at) if stripe_subscription.ended_at.present?
  end
end
