# frozen_string_literal: true

module Webhooks
  class StripeEventsController < ActionController::API
    before_action :set_event

    def create
      StripeEventsConsumer.new.process(@event)

      head :ok
    end

    private

    def set_event
      @event = Stripe::Webhook.construct_event(
        request.body.read,
        request.headers['Stripe-Signature'],
        ENV['STRIPE_WEBHOOK_SECRET']
      )
    rescue Stripe::SignatureVerificationError
      head :bad_request
    end
  end
end
