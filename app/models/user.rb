# frozen_string_literal: true

class User < ApplicationRecord # rubocop:disable Metrics/ClassLength
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :trackable, :validatable

  has_many :card_charges, primary_key: 'stripe_customer_id', foreign_key: 'stripe_customer_id'
  has_many :lifestyle_footprints
  has_many :subscription_months, class_name: 'Subscriptions::SubscriptionMonth'
  belongs_to :referred_from, class_name: 'Subscriptions::ReferralCode', optional: true
  has_many :flight_offsets

  validates :email, format: { with: /\A[a-z0-9+\-_.]+@[a-z\d\-.]+\.[a-z]{2,6}\z/i }
  validates :user_name, format: { without: /.+@.+\..+/ }, allow_blank: true

  attribute :region, :region

  # accessor and validator of :privacy_policy are only here for client side validation via the ClientSideValidations gem
  validates :privacy_policy, acceptance: true
  attr_accessor :privacy_policy

  after_update :update_email_in_stripe

  DEACTIVATED_ACCOUNT_EMAIL_ENDING = '@deactivated.goclimate.com'

  def self.search_email(query, limit = 30)
    where('email LIKE ?', "%#{sanitize_sql_like(query.downcase)}%").limit(limit)
  end

  def stripe_customer
    @stripe_customer ||=
      if stripe_customer_id.present?
        Stripe::Customer.retrieve(id: stripe_customer_id, expand: %w[subscriptions sources])
      else
        create_stripe_customer
      end
  end

  def create_stripe_customer
    Stripe::Customer.create(email: email, expand: ['subscriptions']).tap do |c|
      update_attribute(:stripe_customer_id, c.id)
    end
  end

  def subscription_amount
    return 0 unless active_subscription?

    stripe_customer.subscriptions.first.plan.amount.to_f / 100
  end

  def subscription_amount_in_sek
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
    return false if stripe_customer.deleted?

    stripe_customer.subscriptions&.any?
  end

  def current_plan
    return nil unless active_subscription?
    return nil unless (plan = stripe_customer.subscriptions.first&.plan)

    @current_plan ||= Subscriptions::Plan.from_stripe_plan(plan)
  end

  def subscription_currency
    return nil unless active_subscription?

    current_plan.price.currency
  end

  def subscription_price
    return nil unless active_subscription?

    current_plan.price
  end

  def subscription_billing_date
    return nil unless active_subscription?

    Time.at(stripe_customer.subscriptions.first&.billing_cycle_anchor)
  end

  def footprint_coverage
    return nil unless active_subscription?

    (current_plan.footprint.tonnes / current_lifestyle_footprint.total.tonnes * 100).round
  end

  def three_months_since_last_card_charge?
    return false unless card_charges.present?

    last_card_charge = card_charges.paid.order(created_at: :desc).first
    last_card_charge.created_at < (Date.today - 3.months)
  end

  def deactivated?
    email.include?(DEACTIVATED_ACCOUNT_EMAIL_ENDING)
  end

  def deactivate
    handle_errors_and_return_status do
      raise(StandardError::ArgumentError, 'User is already deactivated') if deactivated?

      if active_subscription?
        subscription_manager = Subscriptions::StripeSubscriptionManager.new(self)
        subscription_manager.cancel
      end

      new_email = "#{Date.today.strftime('%Y-%m-%d')}_#{SecureRandom.hex(3)}#{DEACTIVATED_ACCOUNT_EMAIL_ENDING}"

      Stripe::Customer.update(
        stripe_customer.id,
        email: new_email,
        name: nil,
        phone: nil,
        shipping: nil
      )

      update(
        user_name: nil,
        country: nil,
        email: new_email,
        password: SecureRandom.hex(20)
      )
    end
  end

  def flight_offsets?
    flight_offsets.present?
  end

  private

  def update_email_in_stripe
    return unless errors.blank? && saved_change_to_attribute?('email')

    begin
      Stripe::Customer.update(
        stripe_customer.id,
        email: email
      )
    rescue Stripe::InvalidRequestError => e
      logger.error(e)
      Raven.capture_exception(e)
    end
  end

  def subscription_end_at_from_stripe(stripe_subscription)
    Time.at(stripe_subscription.ended_at) if stripe_subscription.ended_at.present?
  end

  def handle_errors_and_return_status
    yield

    true
  rescue Stripe::InvalidRequestError => e
    errors.add(e.code&.to_sym || :generic, e.message || e.to_s)

    false
  rescue StandardError => e
    errors.add(:base, e.to_s)

    false
  end
end
