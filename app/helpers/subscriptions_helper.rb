# frozen_string_literal: true

module SubscriptionsHelper
  def masked_card_number(stripe_source)
    if stripe_source.object == 'source' && stripe_source.type == 'three_d_secure'
      'XXXX XXXX XXXX XXXX'
    elsif stripe_source.object == 'source'
      'XXXX XXXX XXXX ' + stripe_source.card.last4
    elsif stripe_source.object == 'card'
      'XXXX XXXX XXXX ' + stripe_source.last4
    end
  end
end
