# frozen_string_literal: true

class FlightOffsetsController < ApplicationController
  # Cleanup potential 3D Secure handoff hash before starting fresh, and also after returning.
  before_action :cleanup_three_d_secure_handoff, only: [:create], if: -> { params[:three_d_secure] != 'continue' }
  after_action :cleanup_three_d_secure_handoff, only: [:create], if: -> { params[:three_d_secure] == 'continue' }

  before_action :handle_three_d_secure, only: [:create]
  before_action :force_sv_locale # These views & mailers are Swedish only for now

  def new
    @num_persons = (params[:num_persons].presence || 1).to_i
    @offset_params = FlightOffsetParameters.from_s(params[:offset_params])

    @one_person_footprint = one_person_footprint
    @total_footprint = @one_person_footprint * @num_persons

    @price = (BigDecimal(@total_footprint) / 1000 * LifestyleChoice::SEK_PER_TONNE).to_i * 100
    @projects = Project.order(id: :desc).limit(2)
  end

  def create
    @checkout = FlightOffsetCheckout.new(
      stripe_source: stripe_source,
      amount: amount_param,
      currency: currency_param,
      co2e: co2e_param,
      email: email_param
    )

    unless @checkout.checkout
      new
      render :new
      return
    end

    @offset = @checkout.offset

    redirect_to thank_you_flight_offset_path(@offset)
  end

  def thank_you
    @offset = FlightOffset.find_by_key!(params[:key])
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

  def co2e_param
    session.to_hash.dig('three_d_secure_handoff', 'co2e') || params[:co2e]
  end

  def email_param
    session.to_hash.dig('three_d_secure_handoff', 'email') || params[:email]
  end

  def set_three_d_secure_handoff
    session[:three_d_secure_handoff] = {
      'card_source' => card_source_param,
      'amount' => amount_param,
      'currency' => currency_param,
      'co2e' => co2e_param,
      'email' => email_param
    }
  end

  def cleanup_three_d_secure_handoff
    session.delete(:three_d_secure_handoff)
  end

  def one_person_footprint
    # one_person_footprint param is for partners with own co2 calculation
    # only used temporarily by flygresor.se
    if params[:one_person_footprint].nil?
      FlightFootprint.new(cabin_class: @offset_params.cabin_class, segments: @offset_params.segments).footprint
    else
      params[:one_person_footprint].to_i.abs
    end
  end
end
