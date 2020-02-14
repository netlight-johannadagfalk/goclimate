# frozen_string_literal: true

class StripeEventsConsumer
  def fetch_and_process
    response = Stripe::Event.list(limit: 1000)

    response['data'].each { |event| process(event) }
  end

  def process(event)
    event_object = event.data.object

    case event_object.object
    when 'charge'
      process_charge(event_object)
    when 'subscription'
      update_user(event_object)
    when 'payment_intent'
      process_payment_intent(event_object)
    end
  end

  private

  def process_charge(charge)
    return if CardCharge.exists?(stripe_charge_id: charge.id)

    Rails.logger.debug("Creating CardCharge for charge #{charge.id}")

    event = CardCharge.create_from_stripe_charge(charge)

    Rails.logger.info("Created CardCharge for charge #{charge.id}")

    return if event.gift_card? || event.flight_offset?

    send_payment_email(charge)
  end

  def update_user(subscription)
    return unless (user = User.find_by_stripe_customer_id(subscription.customer))

    Rails.logger.debug("Updating User #{user.id} from subscription #{subscription.id}")

    return unless user.update_from_stripe_subscription(subscription)

    Rails.logger.info("Updated User #{user.id} from subscription #{subscription.id}")
  end

  def process_payment_intent(payment_intent)
    case payment_intent.metadata.checkout_object
    when 'gift_card'
      GiftCard.find_by_payment_intent_id(payment_intent.id)&.update_from_payment_intent(payment_intent)
    end
  end

  def send_payment_email(charge)
    return if charge.customer.nil?

    user = User.find_by_stripe_customer_id(charge.customer)

    return if user.nil?

    if charge.paid
      send_payment_successful_email(user)
    else
      send_payment_failed_email(user)
    end
  end

  def send_payment_successful_email(user)
    number_of_payments = user.number_of_neutral_months
    if number_of_payments % 12 == 0
      SubscriptionMailer.with(email: user.email).one_more_year_email.deliver_now
    else
      SubscriptionMailer.with(email: user.email).one_more_month_email.deliver_now
    end
  end

  def send_payment_failed_email(user)
    SubscriptionMailer.with(email: user.email).payment_failed_email.deliver_now
  end
end
