# frozen_string_literal: true

class SubscriptionSignUp
  attr_reader :plan, :card_source, :email, :customer, :errors
  attr_accessor :three_d_secure_source

  class ThreeDSecureSourceNotChargeableError < StandardError; end

  def initialize(plan, card_source, email)
    @plan = plan
    @card_source = card_source
    @email = email
    @errors = {}
  end

  def sign_up
    assert_three_d_secure_card_is_chargeable_if_present
    create_customer
    perform_intial_three_d_secure_charge_if_present
    create_subscription

    true
  rescue ThreeDSecureSourceNotChargeableError => error
    errors[:verification_failed] = error.message

    false
  rescue Stripe::CardError => error
    errors[error.code.to_sym] = error.message

    false
  end

  private

  def assert_three_d_secure_card_is_chargeable_if_present
    return unless @three_d_secure_source.present?

    source = Stripe::Source.retrieve(@three_d_secure_source)

    return if source.status == 'chargeable'

    raise ThreeDSecureSourceNotChargeableError, 'Card verification was not successful.'
  end

  def create_customer
    @customer =
      Stripe::Customer.create(
        email: @email,
        source: @card_source
      )
  end

  def perform_intial_three_d_secure_charge_if_present
    return unless @three_d_secure_source.present?

    Stripe::Charge.create(
      amount: plan.amount,
      currency: plan.currency,
      source: @three_d_secure_source,
      customer: @customer.id
    )
  end

  def create_subscription
    Stripe::Subscription.create(subscription_values)
  end

  def subscription_values
    {
      customer: customer.id,
      plan: plan.id
    }.tap do |values|
      values[:trial_end] = 1.month.from_now.to_i if @three_d_secure_source.present?
    end
  end
end
