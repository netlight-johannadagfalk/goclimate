# frozen_string_literal: true

module Users
  class SubscriptionsController < ApplicationController
    before_action :authenticate_user!

    def show
      customer = Stripe::Customer.retrieve(current_user.stripe_customer_id)

      @customer_payment_method = customer_payment_method(customer)
      @setup_intent = Stripe::SetupIntent.create(customer: current_user.stripe_customer_id)
      @current_plan_price =
        if customer['subscriptions']['total_count'] > 0
          Money.new(
            customer['subscriptions']['data'][0]['plan']['amount'],
            currency_for_user
          )
        end
      @available_plans = available_plans(@current_plan_price)
    end

    def update
      @manager = SubscriptionManager.for_customer(stripe_customer)

      if plan_param == 'cancel'
        @manager.cancel
        render_successful_update && return
      end

      @current_plan_price = Money.from_amount(plan_param, currency_for_user)
      new_plan = Stripe::Plan.retrieve_or_create_climate_offset_plan(@current_plan_price)

      if @manager.update(new_plan, params[:paymentMethodId])
        render_successful_update
      else
        render_bad_request(@managers.errors)
      end
    end

    private

    def available_plans(current_plan_price)
      plan_price = current_plan_price&.amount || 0
      if currency_for_user == Currency::SEK
        (10...plan_price + 300).step(5)
      else
        (2...plan_price + 30)
      end
        .to_a.push(plan_price).sort
        .map { |amount| Money.from_amount(amount, currency_for_user) }
    end

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
