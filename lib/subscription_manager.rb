# frozen_string_literal: true

class SubscriptionManager
  attr_reader :customer, :errors
  attr_accessor :three_d_secure_source

  class ThreeDSecureSourceNotChargeableError < StandardError; end

  def initialize
    @errors = {}
  end

  def sign_up(email, plan, card_source, three_d_secure_source = nil)
    assert_chargeable_three_d_secure_source(three_d_secure_source) if three_d_secure_source.present?
    create_customer(email, card_source)
    perform_initial_charge(three_d_secure_source, plan) if three_d_secure_source.present?
    create_subscription(plan, three_d_secure_source.present? ? { initial_charge: :charged } : {})

    true
  rescue ThreeDSecureSourceNotChargeableError => error
    errors[:verification_failed] = error.message

    false
  rescue Stripe::CardError => error
    errors[error.code.to_sym] = error.message

    false
  end

  private

  def assert_chargeable_three_d_secure_source(three_d_secure_source)
    source = Stripe::Source.retrieve(three_d_secure_source)

    return if source.status == 'chargeable'

    raise ThreeDSecureSourceNotChargeableError, 'Card verification was not successful.'
  end

  def create_customer(email, card_source)
    @customer =
      Stripe::Customer.create(
        email: email,
        source: card_source
      )
  end

  def perform_initial_charge(source, plan)
    Stripe::Charge.create(
      amount: plan.amount,
      currency: plan.currency,
      source: source,
      customer: @customer.id
    )
  end

  def create_subscription(plan, options = {})
    Stripe::Subscription.create(subscription_values(plan, options))
  end

  def subscription_values(plan, options = {})
    {
      customer: customer.id,
      plan: plan.id
    }.tap do |values|
      values[:trial_end] = 1.month.from_now.to_i if options[:initial_charge] == :charged
    end
  end
end
