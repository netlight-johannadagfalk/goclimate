# frozen_string_literal: true

class FlightOffsetsController < ApplicationController
  before_action :force_sv_locale # These views & mailers are Swedish and SEK only for now
  before_action :permit_params_locale # But we want to be able to show future partners the english translation

  def new
    @num_persons = (params[:num_persons].presence || 1).to_i
    @offset_params = FlightOffsetParameters.from_s(params[:offset_params])

    @footprint_per_person = footprint_per_person
    @total_footprint = @footprint_per_person * @num_persons

    @price = (BigDecimal(@total_footprint) / 1000 * LifestyleChoice::SEK_PER_TONNE).to_i * 100
    @projects = Project.order(id: :desc).limit(2)

    @payment_intent = Stripe::PaymentIntent.create(amount: @price, currency: 'sek')
  end

  def create
    @checkout = FlightOffsetCheckout.new(
      payment_intent: Stripe::PaymentIntent.retrieve(params[:paymentIntentId]),
      amount: params[:amount],
      currency: params[:currency],
      co2e: params[:co2e],
      email: params[:email]
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

  def footprint_per_person
    # footprint_per_person param is for partners with own co2 calculation
    # only used temporarily by flygresor.se
    return params[:footprint_per_person].to_i if params[:footprint_per_person].present?

    FootprintCalculation::FlightFootprint.new(
      cabin_class: @offset_params.cabin_class,
      segments: @offset_params.segments
    ).footprint
  end
end
