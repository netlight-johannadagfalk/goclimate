# frozen_string_literal: true

require 'three_d_secure_verification'
require 'subscription_manager'

module Users
  class SubscriptionsController < ApplicationController
    before_action :authenticate_user!

    # Cleanup potential 3D Secure handoff hash before starting fresh, and also after returning.
    before_action :cleanup_three_d_secure_handoff, only: [:update], if: -> { params[:three_d_secure] != 'continue' }
    after_action :cleanup_three_d_secure_handoff, only: [:update], if: -> { params[:three_d_secure] == 'continue' }

    def show
      @currency = currency_for_user

      customer = Stripe::Customer.retrieve(current_user.stripe_customer_id)

      @current_source = customer.default_source.nil? ? nil : customer.sources.retrieve(customer.default_source)
      @plan =
        if customer['subscriptions']['total_count'] == 0
          0
        else
          customer['subscriptions']['data'][0]['plan']['amount'] / 100
        end
    end

    def update
      @plan = plan_param

      return if redirect_to_applicable_three_d_secure_verification(@plan)

      @manager = SubscriptionManager.for_customer(current_user.stripe_customer_id)

      if @plan == 'cancel'
        @manager.cancel
        redirect_successful_update && return
      end

      new_plan = Stripe::Plan.retrieve_or_create_climate_offset_plan(@plan, currency_for_user)

      redirect_with_error && return unless update_subscription(new_plan)

      redirect_successful_update
    end

    private

    def redirect_to_applicable_three_d_secure_verification(monthly_amount)
      return false unless params[:threeDSecure] == 'required'

      verification = ThreeDSecureVerification.new(
        card_source_param,
        (monthly_amount.to_f * 100).to_i,
        currency_for_user,
        user_subscription_threedsecure_url
      )
      return false unless verification.verification_required?

      set_three_d_secure_handoff
      redirect_to verification.redirect_url
      true
    end

    def update_subscription(new_plan)
      @manager.update(
        new_plan,
        card_source_param,
        params[:three_d_secure] == 'continue' ? params[:source] : nil
      )
    end

    def redirect_with_error
      flash[:error] = "The payment failed: #{@manager.errors.values.join(' ')}"
      redirect_to user_subscription_path
    end

    def redirect_successful_update
      flash[:notice] = I18n.t('your_payment_details_have_been_updated')
      redirect_to user_subscription_path
    end

    def plan_param
      session.to_hash.dig('three_d_secure_handoff', 'plan') || params[:user][:plan]
    end

    def card_source_param
      session.to_hash.dig('three_d_secure_handoff', 'card_source') || params[:stripeSource]
    end

    def set_three_d_secure_handoff
      session[:three_d_secure_handoff] = {
        'plan' => plan_param,
        'card_source' => card_source_param
      }
    end

    def cleanup_three_d_secure_handoff
      session.delete(:three_d_secure_handoff)
    end
  end
end
