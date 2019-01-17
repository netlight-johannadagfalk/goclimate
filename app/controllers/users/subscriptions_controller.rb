# frozen_string_literal: true

require 'three_d_secure_verification'

module Users
  class SubscriptionsController < ApplicationController
    before_action :authenticate_user!

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

      if card_source_param.present?
        customer = Stripe::Customer.retrieve(current_user.stripe_customer_id)

        begin
          card = customer.sources.create(source: card_source_param)
          customer.default_source = card.id
          customer.save
        rescue Stripe::CardError => e
          body = e.json_body
          err  = body[:error]
          flash[:error] = 'Something went wrong with the update of payment method'
          flash[:error] = "The payment failed: #{err[:message]}" if err[:message]
          redirect_to user_subscription_path
          return
        end

        if params[:three_d_secure] == 'continue'
          plan = Stripe::Plan.retrieve_or_create_climate_offset_plan(@plan, currency_for_user)

          Stripe::Charge.create(
            amount: plan.amount,
            currency: plan.currency,
            source: params['source'],
            customer: customer.id
          )

          create_new_threedsecure_subscription(customer.id, plan.id)
        end
      end

      # Re-retrieve because 3D Secure might have changed the current subscription
      customer = Stripe::Customer.retrieve(current_user.stripe_customer_id)

      if @plan == 'cancel'
        if customer['subscriptions']['total_count'] > 0
          subscription = Stripe::Subscription.retrieve(customer['subscriptions']['data'][0]['id'])
          subscription.delete
        end
      elsif customer['subscriptions']['total_count'] == 0 && @plan.to_i > 1
        plan = Stripe::Plan.retrieve_or_create_climate_offset_plan(@plan, currency_for_user)

        Stripe::Subscription.create(
          customer: customer.id,
          plan: plan.id
        )
      else
        current_plan = customer['subscriptions']['data'][0]['plan']['amount'] / 100

        if @plan != current_plan
          subscription = Stripe::Subscription.retrieve(customer['subscriptions']['data'][0]['id'])
          plan = Stripe::Plan.retrieve_or_create_climate_offset_plan(@plan, currency_for_user)

          subscription.plan = plan['id']
          subscription.prorate = false
          subscription.save
        end
      end

      flash[:notice] = I18n.t('your_payment_details_have_been_updated')
      redirect_to user_subscription_path
    end

    private

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

    def create_new_threedsecure_subscription(customer_id, plan_id)
      subscriptions = Stripe::Subscription.list(customer: customer_id)
      subscriptions.each(&:delete)

      Stripe::Subscription.create(
        customer: customer_id,
        items: [
          {
            plan: plan_id
          }
        ],
        trial_end: 1.month.from_now.to_i
      )
    end
  end
end
