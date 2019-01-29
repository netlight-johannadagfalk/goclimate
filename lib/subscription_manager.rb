# frozen_string_literal: true

class SubscriptionManager
  attr_reader :customer, :errors

  class ThreeDSecureSourceNotChargeableError < StandardError; end

  def self.for_customer(customer_id)
    new(Stripe::Customer.retrieve(customer_id))
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

  def update(new_plan, new_card_source = nil, three_d_secure_source = nil)
    handle_errors_and_return_status do
      if three_d_secure_source.present?
        assert_chargeable_three_d_secure_source(three_d_secure_source)
        perform_initial_charge(three_d_secure_source, new_plan)
      end

      update_default_card(new_card_source) if new_card_source.present?

      if subscription.nil?
        create_subscription(new_plan, three_d_secure_source.present?)
      elsif subscription.plan.id != new_plan.id || three_d_secure_source.present?
        update_subscription(new_plan, three_d_secure_source.present?)
      end
    end
  end

  private

  def handle_errors_and_return_status
    yield

    true
  rescue ThreeDSecureSourceNotChargeableError => error
    errors[:verification_failed] = error.message

    false
  rescue Stripe::CardError => error
    errors[error.code.to_sym] = error.message

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

  def update_subscription(new_plan, skip_next_charge = false)
    subscription.plan = new_plan.id unless subscription.plan.id == new_plan.id
    subscription.trial_end = 1.month.from_now.to_i if skip_next_charge
    subscription.prorate = false
    subscription.save
  end

  def update_default_card(new_card_source)
    card = @customer.sources.create(source: new_card_source)
    customer.default_source = card.id
    customer.save
  end

  def subscription
    @customer.subscriptions.first
  end
end
