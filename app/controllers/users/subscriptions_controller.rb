# frozen_string_literal: true

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
      @plan = params[:user][:plan]

      customer = Stripe::Customer.retrieve(current_user.stripe_customer_id)

      if params[:stripeSource].present?
        begin
          if params[:threeDSecure] == 'required'
            customer.source = params[:stripeSource]
            customer.save

            source = Stripe::Source.create(
              amount: (@plan.to_f * 100).round,
              currency: currency_for_user,
              type: 'three_d_secure',
              three_d_secure: {
                customer: customer.id,
                card: params[:stripeSource]
              },
              redirect: {
                return_url: user_subscription_threedsecure_url + '?email=' + current_user.email + '&plan=' + @plan.to_s +
                            '&updatecard=1' + '&customer=' + customer.id
              }
            )

            # Checking if verification is still required
            # -> https://stripe.com/docs/sources/three-d-secure
            unless ((source.redirect.status == 'succeeded' || source.redirect.status == 'not_required') && source.three_d_secure.authenticated == false) || source.status == 'failed'
              redirect_to source.redirect.url
              return
            end
          end

          card = customer.sources.create(source: params[:stripeSource])
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
      end

      if @plan.present?
        if current_user.stripe_customer_id.nil?
          flash[:notice] = I18n.t('something_went_wrong_with_the_credit_card_please_submit_it_again')
          redirect_to user_subscription_path
          return
        end

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
            stripe_plan = Stripe::Plan.retrieve_or_create_climate_offset_plan(@plan, currency_for_user)

            return if stripe_plan == false

            subscription.plan = stripe_plan['id']
            subscription.prorate = false
            subscription.save
          end
        end
      end

      flash[:notice] = I18n.t('your_payment_details_have_been_updated')
      redirect_to user_subscription_path
    end

    def threedsecure
      plan = Stripe::Plan.retrieve_or_create_climate_offset_plan(params[:plan], currency_for_user)
      source = Stripe::Source.retrieve(params['source'])

      if source.status == 'failed'
        flash[:error] = 'Something went wrong with the payment, please check if your card is chargable and try again.'

        redirect_to user_subscription_path
        return
      end

      Stripe::Charge.create(
        amount: plan.amount,
        currency: plan.currency,
        source: params['source'],
        customer: params[:customer]
      )

      User.where('lower(email) = ?', params[:email].downcase).update_all(stripe_customer_id: params[:customer])

      create_new_threedsecure_subscription(params[:customer], plan.id)

      flash[:notice] = I18n.t('your_payment_details_have_been_updated')
      redirect_to user_subscription_path
    end

    private

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
