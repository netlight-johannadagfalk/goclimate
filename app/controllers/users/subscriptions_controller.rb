# frozen_string_literal: true

module Users
  class SubscriptionsController < ApplicationController
    before_action :authenticate_user!
    before_action :notice_updated, only: [:show]
    before_action :set_subscription_manager

    def show
      @customer_payment_method = customer_payment_method
      @current_plan_price = @manager.subscription&.plan&.monthly_amount
      @available_plans = available_plans(@current_plan_price)
    end

    def update
      new_plan = Stripe::Plan.retrieve_or_create_climate_offset_plan(
        Money.from_amount(plan_param, customer_currency)
      )

      if @manager.subscription.present?
        @manager.update(new_plan, params[:payment_method_id])
      else
        @manager.sign_up(new_plan, params[:payment_method_id])
      end

      if @manager.errors.any?
        render_bad_request(@manager.errors)
      elsif @manager.confirmation_required?
        render_confirmation_required
      else
        render_successful_update
      end
    end

    def destroy
      SubscriptionCancellationFeedback.create(cancellation_reason_params)
      @manager.cancel

      flash[:notice] = I18n.t('views.subscriptions.cancel.cancellation_successful')
      redirect_to action: :show
    end

    private

    # Because we can't always be sure an update is complete before client side
    # things happen, let the client redirect to a query param to set the notice
    # in those cases.
    def notice_updated
      return unless params[:updated] == '1'

      flash[:notice] = I18n.t('your_payment_details_have_been_updated')
      redirect_to user_subscription_path
    end

    def set_subscription_manager
      @manager = SubscriptionManager.new(current_user.stripe_customer)
    end

    def render_successful_update
      flash[:notice] = I18n.t('your_payment_details_have_been_updated')
      render json: { next_step: 'redirect', success_url: user_subscription_path }, status: :ok
    end

    def render_confirmation_required
      render json: {
        next_step: 'confirmation_required',
        intent_type: @manager.intent_to_confirm.object,
        intent_client_secret: @manager.intent_to_confirm.client_secret,
        success_url: user_subscription_path(updated: 1)
      }, status: :ok
    end

    def render_bad_request(errors)
      render json: { error: errors }, status: :bad_request
    end

    def available_plans(current_plan_price)
      starting_plan_price = current_plan_price&.amount || 0
      plans =
        if customer_currency == Currency::SEK
          (10...starting_plan_price + 300).step(5)
        else
          (2...starting_plan_price + 30)
        end.to_a

      plans.push(current_plan_price.amount) if current_plan_price.present? && !plans.include?(current_plan_price.amount)

      plans.sort.map { |amount| Money.from_amount(amount, customer_currency) }
    end

    def customer_currency
      Currency.from_iso_code(@manager.customer.currency) || current_region.currency
    end

    def customer_payment_method
      return nil unless (payment_method_id = @manager.customer.invoice_settings&.default_payment_method)

      Stripe::PaymentMethod.retrieve(payment_method_id)
    end

    def plan_param
      params[:user][:plan]
    end

    def cancellation_reason_params
      {
        subscribed_at: Time.at(@manager.subscription.start_date),
        reason:
          if params[:cancellation_reason] == 'other'
            params[:cancellation_reason_other_text]
          else
            params[:cancellation_reason]
          end
      }
    end
  end
end
