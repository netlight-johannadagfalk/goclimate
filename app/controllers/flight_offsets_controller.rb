# frozen_string_literal: true

class FlightOffsetsController < ApplicationController
  # Cleanup potential 3D Secure handoff hash before starting fresh, and also after returning.
  before_action :cleanup_three_d_secure_handoff, only: [:create], if: -> { params[:three_d_secure] != 'continue' }
  after_action :cleanup_three_d_secure_handoff, only: [:create], if: -> { params[:three_d_secure] == 'continue' }

  before_action :handle_three_d_secure, only: [:create]

  def new
    @num_persons = (params[:num_persons].presence || 1).to_i
    @offset_params = FlightOffsetParameters.from_s(params[:offset_params])

    footprint = FlightFootprint.new(cabin_class: @offset_params.cabin_class, segments: @offset_params.segments)

    @total_footprint = footprint.footprint * @num_persons
    @price = (BigDecimal(@total_footprint) / 1000 * LifestyleChoice::SEK_PER_TONNE).to_i * 100
    @projects = Project.order(id: :desc).limit(2)
  end

  def create
    @checkout = FlightOffsetCheckout.new(stripe_source, amount_param, currency_param)

    unless @checkout.checkout
      new
      render :new
      return
    end

    @offset = FlightOffset.create!(
      params.permit(:co2e, :email)
            .merge(charged_amount: @checkout.charge.amount,
                   charged_currency: @checkout.charge.currency,
                   stripe_charge_id: @checkout.charge.id)
    )

    redirect_to action: :thank_you
  end

  def thank_you
    @certificate_key = flash[:amount_co2] || 'NA'
    @stripe_event_id = '123'
  end

  private

  def handle_three_d_secure
    return unless params[:threeDSecure] == 'required'

    verification = ThreeDSecureVerification.new(
      card_source_param, amount_param, currency_param, threedsecure_flight_offsets_url
    )
    return unless verification.verification_required?

    set_three_d_secure_handoff
    redirect_to verification.redirect_url
  end

  def stripe_source
    if params['three_d_secure'] == 'continue'
      params['source']
    else
      card_source_param
    end
  end

  def card_source_param
    session.to_hash.dig('three_d_secure_handoff', 'card_source') || params[:stripeSource]
  end

  def amount_param
    session.to_hash.dig('three_d_secure_handoff', 'amount') || params[:amount]
  end

  def currency_param
    session.to_hash.dig('three_d_secure_handoff', 'currency') || params[:currency]
  end

  def set_three_d_secure_handoff
    session[:three_d_secure_handoff] = {
      'card_source' => card_source_param,
      'amount' => amount_param,
      'currency' => currency_param
    }
  end

  def cleanup_three_d_secure_handoff
    session.delete(:three_d_secure_handoff)
  end
end
