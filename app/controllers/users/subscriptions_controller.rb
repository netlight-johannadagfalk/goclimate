# frozen_string_literal: true

module Users
  class SubscriptionsController < ApplicationController
    before_action :authenticate_user!

    def show
      @currency = currency_for_user

      customer = Stripe::Customer.retrieve(current_user.stripe_customer_id)

      @customer_payment_method = customer_payment_method(customer)
      @setup_intent = Stripe::SetupIntent.create(customer: current_user.stripe_customer_id)
      @plan =
        if customer['subscriptions']['total_count'] == 0
          0
        else
          customer['subscriptions']['data'][0]['plan']['amount'] / 100
        end
    end

    def update
      @plan = plan_param

      @manager = SubscriptionManager.for_customer(stripe_customer)

      if @plan == 'cancel'
        @manager.cancel
        render_successful_update && return
      end

      new_plan = Stripe::Plan.retrieve_or_create_climate_offset_plan(@plan, currency_for_user)

      if @manager.update(new_plan, params[:paymentMethodId])
        render_successful_update
      else
        render_bad_request(@managers.errors)
      end
    end

    private

    def render_bad_request(errors)
      render json: errors, status: :bad_request
    end

    def stripe_customer
      Stripe::Customer.retrieve(current_user.stripe_customer_id)
    end

    def customer_payment_method(customer)
      if customer.invoice_settings&.default_payment_method
        Stripe::PaymentMethod.retrieve(customer.invoice_settings.default_payment_method)
      elsif customer.default_source
        customer.sources.retrieve(customer.default_source)
      end
    end

    def update_subscription(new_plan)
      @manager.update(
        new_plan,
        card_source_param,
        params[:three_d_secure] == 'continue' ? params[:source] : nil
      )
    end

    def render_successful_update
      flash[:notice] = I18n.t('your_payment_details_have_been_updated')
      render json: { redirectTo: user_subscription_path, notice: notice }, status: :ok
    end

    def plan_param
      params[:user][:plan]
    end

    def card_source_param
      params[:stripeSource]
    end
  end
end
