# frozen_string_literal: true

module SubscriptionsHelper
  def masked_card_number(stripe_source)
    return '••••' if three_d_secure_source(stripe_source)

    case stripe_source.object
    when 'source', 'payment_method'
      "•••• #{stripe_source&.card&.last4}"
    when 'card'
      '•••• ' + stripe_source&.last4
    end
  end

  def card_expiration(stripe_source)
    return '' if three_d_secure_source(stripe_source)

    case stripe_source.object
    when 'source', 'payment_method'
      "#{stripe_source&.card&.exp_month}/#{stripe_source&.card&.exp_year}"
    when 'card'
      "#{stripe_source&.exp_month}/#{stripe_source&.exp_year}"
    end
  end

  def card_brand(stripe_source)
    return '' if three_d_secure_source(stripe_source)

    case stripe_source&.object
    when 'source', 'payment_method'
      stripe_source&.card&.brand&.downcase
    when 'card'
      stripe_source&.brand&.downcase
    end
  end

  private

  def three_d_secure_source(stripe_source)
    stripe_source&.object == 'source' && stripe_source&.type == 'three_d_secure'
  end
end
