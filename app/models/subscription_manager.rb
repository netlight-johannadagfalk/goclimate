# frozen_string_literal: true

class SubscriptionManager
  class SubscriptionMissingError < StandardError; end

  BUFFER_FACTOR = 2

  attr_reader :customer, :errors, :intent_to_confirm

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

  # NOTE: Keeping a Stripe::Customer up to date might be more of a task for
  # User, as updates to the email should propagate to Stripe and because
  # subscriptions might not be the only case we want to use Stripe::Customers
  # for. Something for the future maybe.
  def self.for_new_customer(email)
    new(Stripe::Customer.create(email: email))
  end

  def initialize(customer)
    @customer = customer
    @errors = {}
  end

  def sign_up(plan, payment_method_id)
    handle_errors_and_return_status do
      update_default_card(payment_method_id)
      create_subscription(plan)
      @intent_to_confirm = subscription.latest_invoice.payment_intent if subscription.status == 'incomplete'
    end
  end

  def update(new_plan, payment_method_id = nil)
    raise SubscriptionMissingError, <<~TEXT if subscription.nil?
      Can't update subscription without a current one present.
    TEXT

    handle_errors_and_return_status do
      if payment_method_id.present?
        update_default_card(payment_method_id)

        setup_intent = Stripe::SetupIntent.create(
          payment_method: payment_method_id, confirm: true, customer: customer.id
        )
        @intent_to_confirm = setup_intent if setup_intent.status == 'requires_action'
      end

      update_subscription(new_plan) if subscription.plan.id != new_plan.id
    end
  end

  def cancel
    subscription.delete

    Stripe::PaymentMethod.list(customer: customer.id, type: 'card').each do |payment_method|
      Stripe::PaymentMethod.detach(payment_method.id)
    end
  end

  def confirmation_required?
    intent_to_confirm.present?
  end

  def subscription
    @subscription ||= customer.subscriptions.first
  end

  private

  def handle_errors_and_return_status
    yield

    true
  rescue Stripe::CardError => e
    errors[e.code&.to_sym || :generic] = e.message || e.to_s

    false
  end

  def create_subscription(plan)
    @subscription = Stripe::Subscription.create(
      customer: customer.id,
      plan: plan.id,
      expand: ['latest_invoice.payment_intent']
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
    Stripe::PaymentMethod.attach(payment_method, customer: customer.id)
    Stripe::Customer.update(customer.id, invoice_settings: { default_payment_method: payment_method })
  end
end
