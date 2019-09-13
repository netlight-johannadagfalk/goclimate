# frozen_string_literal: true

class SubscriptionManager
  attr_reader :customer, :errors

  class ThreeDSecureSourceNotChargeableError < StandardError; end

  def self.for_customer(customer)
    new(customer)
  end

  def initialize(customer = nil)
    @customer = customer
    @errors = {}
  end

  def sign_up(email, plan, card_source, three_d_secure_source = nil)
    handle_errors_and_return_status do
      assert_chargeable_three_d_secure_source(three_d_secure_source) if three_d_secure_source.present?
      create_customer(email, card_source)
      perform_initial_charge(three_d_secure_source, plan) if three_d_secure_source.present?
      create_subscription(plan, three_d_secure_source.present?)
    end
  end

  def cancel
    @customer.subscriptions.each(&:delete)
  end

  def update(new_plan, payment_method_id = nil)
    handle_errors_and_return_status do
      update_default_card(payment_method_id) if payment_method_id.present?

      if subscription.nil?
        create_subscription(new_plan)
      elsif subscription.plan.id != new_plan.id
        update_subscription(new_plan)
      end
    end
  end

  private

  def handle_errors_and_return_status
    yield

    true
  rescue ThreeDSecureSourceNotChargeableError => e
    errors[:verification_failed] = e.message

    false
  rescue Stripe::CardError => e
    errors[e.code.to_sym] = e.message

    false
  end

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

  def create_subscription(plan, skip_first_charge = false)
    Stripe::Subscription.create(
      customer: customer.id,
      plan: plan.id,
      trial_end: skip_first_charge ? 1.month.from_now.to_i : nil
    )
  end

  def update_subscription(new_plan)
    Stripe::Subscription.update(
      subscription.id,
      prorate: false,
      plan: new_plan.id
    )
  end

  def update_default_card(payment_method)
    Stripe::PaymentMethod.attach(payment_method, customer: customer.id)
    Stripe::Customer.update(customer.id, invoice_settings: { default_payment_method: payment_method })
  end

  def subscription
    @customer.subscriptions.first
  end
end
