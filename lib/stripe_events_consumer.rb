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
    end
  end

  private

  def process_charge(charge)
    return if StripeEvent.exists?(stripe_event_id: charge.id)

    Rails.logger.debug("Creating StripeEvent for charge #{charge.id}")

    gift_card_charge = charge_is_for_gift_card?(charge)

    StripeEvent.create_from_stripe_charge(charge, gift_card_charge)

    Rails.logger.info("Created StripeEvent for charge #{charge.id}")

    return if gift_card_charge

    send_payment_email(charge)
  end

  def update_user(subscription)
    return unless (user = User.find_by_stripe_customer_id(subscription.customer))

    Rails.logger.debug("Updating User #{user.id} from subscription #{subscription.id}")

    return unless user.update_from_stripe_subscription(subscription)

    Rails.logger.info("Updated User #{user.id} from subscription #{subscription.id}")
  end

  def charge_is_for_gift_card?(charge)
    charge.description.present? &&
      charge.description.include?(GiftCardsCheckout::STRIPE_DESCRIPTION_BASE)
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
    number_of_payments = StripeEvent.payments(user).where(paid: true).count
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
