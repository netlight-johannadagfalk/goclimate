# frozen_string_literal: true

class FlightOffsetsController < ApplicationController
  def new
    @num_persons = (params[:num_persons].presence || 1).to_i
    @offset_params = FlightOffsetParameters.from_s(params[:offset_params])

    @footprint_per_person = footprint_per_person
    @total_footprint = @footprint_per_person * @num_persons

    @price = @total_footprint.consumer_price(current_region.currency)
    @projects = Project.order(id: :desc).limit(2)

    @payment_intent = Stripe::PaymentIntent.create(
      amount: @price.subunit_amount,
      currency: @price.currency,
      description: 'Flight offset'
    )
  end

  def create
    payment_intent = Stripe::PaymentIntent.retrieve(params[:paymentIntentId])

    @offset = FlightOffset.new(
      payment_intent_id: payment_intent.id,
      price: amount_from_params,
      co2e: params[:co2e],
      email: params[:email]
    )

    unless @offset.save
      new
      render :new
      return
    end

    @offset.send_confirmation_email

    redirect_to thank_you_flight_offset_path(@offset)
  end

  def thank_you
    @offset = FlightOffset.find_by_key!(params[:key])
  end

  private

  def footprint_per_person
    # footprint_per_person param is for partners with own co2 calculation
    # only used temporarily by flygresor.se
    return GreenhouseGases.new(params[:footprint_per_person].to_i) if params[:footprint_per_person].present?

    FootprintCalculation::FlightFootprint.new(
      cabin_class: @offset_params.cabin_class,
      segments: @offset_params.segments
    ).footprint
  end

  def amount_from_params
    Money.from_amount(params[:amount], Currency.from_iso_code(params[:currency]))
  end

  protected

  def canonical_query_params
    super + [:offset_params]
  end
end
