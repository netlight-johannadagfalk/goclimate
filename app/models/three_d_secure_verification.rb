# frozen_string_literal: true

class ThreeDSecureVerification
  def initialize(card_source, amount, currency, return_url)
    @source = Stripe::Source.create(
      amount: amount,
      currency: currency,
      type: 'three_d_secure',
      three_d_secure: {
        card: card_source
      },
      redirect: { return_url: return_url }
    )
  end

  def verification_required?
    return false if @source.nil?
    return false if @source.redirect.status == 'not_required' || @source.status == 'failed'

    true
  end

  def redirect_url
    @source.redirect.url
  end
end
