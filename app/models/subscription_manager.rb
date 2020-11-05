# frozen_string_literal: true

class SubscriptionManager # rubocop:disable Metrics/ClassLength
  class SubscriptionMissingError < StandardError; end

  BUFFER_FACTOR = 2

  attr_reader :user, :errors, :intent_to_confirm

  def self.price_for_footprint(footprint, currency)
    monthly_offset = footprint / 12 * BUFFER_FACTOR
    price = monthly_offset.consumer_price(currency)

    case price.currency
    when Currency::SEK
      Money.new(
        ((price.subunit_amount.to_d / 5).ceil(-2) * 5).to_i,
        :sek
      )
    else
      price
    end
  end

  def initialize(user)
    @user = user
    @errors = {}
  end

  def sign_up(plan, payment_method_id, referral_code = nil) # rubocop:disable Metrics/MethodLength
    handle_errors_and_return_status do
      update_default_card(payment_method_id)

      if referral_code.present?
        create_subscription(plan, 1.month.from_now)
        create_trial_subscription_month(referral_code)
        user.update_attribute(:referred_from, referral_code)
        set_intent_to_confirm_if_action_required(payment_method_id, user.stripe_customer.id)
      else
        create_subscription(plan)
      end
      @intent_to_confirm = subscription.latest_invoice.payment_intent if subscription.status == 'incomplete'
      user.stripe_customer.refresh

      if user.first_subscription_created_at.nil?
        user.update_attribute(:first_subscription_created_at, Time.at(subscription&.start_date))
      end
    end
  end

  def update(new_plan, payment_method_id = nil)
    raise SubscriptionMissingError, <<~TEXT if subscription.nil?
      Can't update subscription without a current one present.
    TEXT

    handle_errors_and_return_status do
      if payment_method_id.present?
        update_default_card(payment_method_id)
        set_intent_to_confirm_if_action_required(payment_method_id, user.stripe_customer.id)
      end

      update_subscription(new_plan) if subscription.plan.id != new_plan.id
      user.stripe_customer.refresh
    end
  end

  def cancel
    subscription.delete
    @subscription = nil

    Stripe::PaymentMethod.list(customer: user.stripe_customer.id, type: 'card').each do |payment_method|
      Stripe::PaymentMethod.detach(payment_method.id)
    end

    user.stripe_customer.refresh
  end

  def confirmation_required?
    intent_to_confirm.present?
  end

  def subscription
    @subscription ||= user.stripe_customer.subscriptions.first
  end

  private

  def handle_errors_and_return_status
    yield

    true
  rescue Stripe::CardError => e
    errors[e.code&.to_sym || :generic] = e.message || e.to_s

    false
  end

  def create_subscription(plan, trial_end = nil)
    @subscription = Stripe::Subscription.create(
      customer: user.stripe_customer.id,
      plan: plan.id,
      trial_end: trial_end&.to_i,
      expand: ['latest_invoice.payment_intent']
    )
  end

  def create_trial_subscription_month(referral_code)
    SubscriptionMonth.create!(
      user: user,
      payment: referral_code,
      start_at: Time.at(subscription.start_date),
      co2e: GreenhouseGases.from_consumer_price(
        Money.new(subscription.plan.amount, subscription.plan.currency.to_sym)
      )
    )
  end

  def update_subscription(new_plan)
    @subscription = Stripe::Subscription.update(
      subscription.id,
      plan: new_plan.id,
      prorate: false
    )
  end

  def update_default_card(payment_method)
    Stripe::PaymentMethod.attach(payment_method, customer: user.stripe_customer.id)
    Stripe::Customer.update(user.stripe_customer.id, invoice_settings: { default_payment_method: payment_method })
  end

  def set_intent_to_confirm_if_action_required(payment_method_id, stripe_customer_id)
    setup_intent = Stripe::SetupIntent.create(
      payment_method: payment_method_id, confirm: true, customer: stripe_customer_id
    )
    @intent_to_confirm = setup_intent if setup_intent.status == 'requires_action'
  end
end
