# frozen_string_literal: true

require 'three_d_secure_verification'
require 'subscription_manager'

module Users
  class SubscriptionsController < ApplicationController
    before_action :authenticate_user!

    # Cleanup potential 3D Secure handoff hash before starting fresh, and also after returning.
    before_action :cleanup_three_d_secure_handoff, only: [:show]
    after_action :cleanup_three_d_secure_handoff, only: [:update], if: -> { params[:three_d_secure] == 'continue' }

    def show
      @currency = currency_for_user

      if current_user.stripe_customer_id.nil?
        @current_card = 'no payment method'
        @plan = LifestyleChoice.stripe_plan(current_user.lifestyle_choices.map(&:id).join(','))
        return
      end

      customer = Stripe::Customer.retrieve(current_user.stripe_customer_id)

      if customer.default_source.nil?
        @current_card = nil
      else
        current_source = customer.sources.retrieve(customer.default_source)

        if current_source.object == 'source' && current_source.type == 'three_d_secure'
          @current_card = 'XXXX XXXX XXXX XXXX'
        elsif current_source.object == 'source'
          @current_card = 'XXXX XXXX XXXX ' + current_source.card.last4
        elsif current_source.object == 'card'
          @current_card = 'XXXX XXXX XXXX ' + current_source.last4
        end
      end

      @plan =
        if customer['subscriptions']['total_count'] == 0
          0
        else
          customer['subscriptions']['data'][0]['plan']['amount'] / 100
        end
    end

    def update
      @plan = plan_param

      if params[:threeDSecure] == 'required' && (verification = create_three_d_secure_verification(@plan)).verification_required?
        session[:three_d_secure_handoff] = three_d_secure_handoff_hash
        redirect_to verification.redirect_url
        return
      end

      manager = SubscriptionManager.for_customer(current_user.stripe_customer_id)

      if @plan == 'cancel'
        manager.cancel
        redirect_successful_update && return
      end

      new_plan = Stripe::Plan.retrieve_or_create_climate_offset_plan(@plan, currency_for_user)

      unless manager.update(new_plan, card_source_param, params[:three_d_secure] == 'continue' ? params[:source] : nil)
        flash[:error] = "The payment failed: #{manager.errors.values.join(' ')}"
        redirect_to user_subscription_path
        return
      end

      redirect_successful_update
    end

    private

    def cleanup_three_d_secure_handoff
      session.delete(:three_d_secure_handoff)
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

    def three_d_secure_handoff_hash
      {
        'plan' => @plan,
        'card_source' => card_source_param
      }
    end

    def create_three_d_secure_verification(monthly_amount)
      ThreeDSecureVerification.new(
        card_source_param,
        (monthly_amount.to_f * 100).to_i,
        currency_for_user,
        user_subscription_threedsecure_url
      )
    end
  end
end
