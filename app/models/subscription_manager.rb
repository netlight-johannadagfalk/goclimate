# frozen_string_literal: true

class SubscriptionManager
  attr_reader :customer, :errors, :payment_intent

  class ThreeDSecureSourceNotChargeableError < StandardError; end

  def self.for_customer(customer, payment_intent = nil)
    new(customer, payment_intent)
  end

  def initialize(customer = nil, payment_intent = nil)
    @customer = customer
    @errors = {}
    @payment_intent = payment_intent
  end

  def customer_id
    customer&.id
  end

  def sign_up(email, plan, payment_method_id)
    handle_errors_and_return_status do
      @customer = Stripe::Customer.create(email: email)
      update_default_card(payment_method_id)
      new_subscription = create_subscription(plan)
      @payment_intent = new_subscription.latest_invoice.payment_intent
      return true if new_subscription.status == 'active'

      errors[:payment] = 'Payment failed, please try again' unless requires_3dsecure(new_subscription)
      return false
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

  def payment_intent_client_secret
    @payment_intent&.client_secret
  end

  private

  def requires_3dsecure(subscription)
    subscription.status == 'incomplete' && @payment_intent.status == 'requires_action'
  end

  def handle_errors_and_return_status
    yield

    true
  rescue Stripe::StripeError => e
    errors[e.code&.to_sym || :generic] = e.message || e.to_s
    false
  end

  def create_subscription(plan)
    Stripe::Subscription.create(
      customer: customer.id,
      plan: plan.id,
      expand: ['latest_invoice.payment_intent']
    )
  end

  def update_subscription(new_plan)
    Stripe::Subscription.update(
      subscription.id,
      prorate: false,
      plan: new_plan.id,
      expand: ['latest_invoice.payment_intent']
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
