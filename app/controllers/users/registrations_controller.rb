# frozen_string_literal: true

module Users
  class RegistrationsController < Devise::RegistrationsController
    # before_action :configure_sign_up_params, only: [:create]
    # before_action :configure_account_update_params, only: [:update]

    prepend_before_action :authenticate_scope!, only: [:edit, :update, :destroy, :payment]

    def after_update_path_for(resource)
      edit_user_registration_path(resource)
    end

    # GET /resource/sign_up
    def new
      if params[:choices].nil? || !params[:choices].include?(',')
        redirect_to '/#choose-plan'
        return
      end

      @plan = LifestyleChoice.stripe_plan(params[:choices])
      @currency = currency_for_user

      super
    end

    # POST /resource
    def create
      @plan = LifestyleChoice.stripe_plan(params[:user][:choices])
      choices = params[:user][:choices].split(',').map(&:to_i)

      begin
        if params[:user][:choices].nil? || params[:user][:choices].match(/\d+,\d+,\d+,\d/).nil?
          flash[:error] = I18n.t('something_went_wrong_go_back_one_step_and_try_again')
          redirect_to new_user_registration_path(choices: params[:user][:choices])
          return
        end

        if params[:user][:email].nil? || params[:user][:email].length < 4
          flash[:error] = I18n.t('activerecord.errors.models.user.attributes.email.blank')
          redirect_to new_user_registration_path(choices: params[:user][:choices])
          return
        end

        if params[:user][:password].nil? || params[:user][:password].length < 6
          flash[:error] = I18n.t('activerecord.errors.models.user.attributes.password.blank')
          redirect_to new_user_registration_path(choices: params[:user][:choices])
          return
        end

        if params[:stripeSource].nil?
          flash[:error] = 'Oops, an error occured, please try again!'
          redirect_to new_user_registration_path(choices: params[:user][:choices])
          return
        end

        user = User.find_for_authentication(email: params[:user][:email])

        if user.present?
          if user.stripe_customer_id.nil?
            user.delete
          else
            flash[:error] = I18n.t('activerecord.errors.models.user.attributes.email.taken')
            redirect_to new_user_registration_path(choices: params[:user][:choices])
            return
          end
        end

        customer = Stripe::Customer.create(
          email: params[:user][:email],
          source: params[:stripeSource]
        )

        # 3dsecure is required
        if params[:threeDSecure] == 'required'
          source = Stripe::Source.create(
            amount: (@plan.to_f * 100).round,
            currency: currency_for_user,
            type: 'three_d_secure',
            three_d_secure:
              {
                customer: customer.id,
                card: params[:stripeSource]
              },
            redirect:
              {
                return_url: threedsecure_url + '?email=' + params[:user][:email] + '&plan=' + @plan.to_s +
                            '&choices=' + params[:user][:choices] + '&customer=' + customer.id
              }
          )

          # Checking if verification is still required
          # -> https://stripe.com/docs/sources/three-d-secure
          unless ((source.redirect.status == 'succeeded' || source.redirect.status == 'not_required') && source.three_d_secure.authenticated == false) || source.status == 'failed'
            user = User.new(email: params[:user][:email], password: params[:user][:password])
            user.save

            choices.each do |choice_id|
              user.lifestyle_choices << LifestyleChoice.find(choice_id)
            end

            redirect_to source.redirect.url
            return
          end
        end

        plan = get_stripe_plan(@plan, new_user_registration_path)

        return if plan == false

        Stripe::Subscription.create(
          customer: customer.id,
          plan: plan.id
        )
      rescue Stripe::CardError => e
        body = e.json_body
        err  = body[:error]
        flash[:error] = 'Something went wrong with the payment'
        flash[:error] = "The payment failed: #{err[:message]}" if err[:message]
        redirect_to new_user_registration_path(choices: params[:user][:choices])
        return
      end

      super

      User.where('lower(email) = ?', params[:user][:email].downcase).update_all(stripe_customer_id: customer.id)

      user = User.find_for_authentication(email: params[:user][:email])

      choices.each do |choice_id|
        user.lifestyle_choices << LifestyleChoice.find(choice_id)
      end
    end

    def threedsecure
      user = User.find_for_authentication(email: params[:email])
      plan = get_stripe_plan(params[:plan], new_user_registration_path)
      source = Stripe::Source.retrieve(params['source'])

      if source.status == 'failed'
        flash[:error] = 'Something went wrong with the payment, please check if your card is chargable and try again.'

        if !params[:updatecard].nil? && params[:updatecard] == '1'
          redirect_to payment_path
        else
          user.delete
          redirect_to new_user_registration_path(choices: params[:choices])
        end

        return
      end

      Stripe::Charge.create(
        amount: plan.amount,
        currency: plan.currency,
        source: params['source'],
        customer: params[:customer]
      )

      User.where('lower(email) = ?', params[:email].downcase).update_all(stripe_customer_id: params[:customer])

      Stripe::Subscription.create(
        customer: params[:customer],
        items: [
          {
            plan: plan.id
          }
        ],
        trial_end: 1.month.from_now.to_i
      )

      if !params[:updatecard].nil? && params[:updatecard] == '1'
        flash[:notice] = I18n.t('your_payment_details_have_been_updated')
        redirect_to payment_path
      else
        flash[:notice] = I18n.t('devise.registrations.signed_up')
        sign_in(user)
        redirect_to user_root_url
      end
    end

    # GET /resource/edit
    def edit
      super
    end

    def payment
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

    # PUT /resource
    def update
      @plan = params[:user][:plan]

      if params[:stripeSource].present?

        begin
          if current_user.stripe_customer_id.nil?
            customer = Stripe::Customer.create(
              email: current_user.email
            )
            current_user.stripe_customer_id = customer.id
            current_user.save
          end

          if params[:threeDSecure] == 'required'

            customer = Stripe::Customer.retrieve(current_user.stripe_customer_id)
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
                return_url: threedsecure_url + '?email=' + current_user.email + '&plan=' + @plan.to_s +
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

          customer = Stripe::Customer.retrieve(current_user.stripe_customer_id)
          card = customer.sources.create(source: params[:stripeSource])
          customer.default_source = card.id
          customer.save
        rescue Stripe::CardError => e
          body = e.json_body
          err  = body[:error]
          flash[:error] = 'Something went wrong with the update of payment method'
          flash[:error] = "The payment failed: #{err[:message]}" if err[:message]
          redirect_to payment_path
          return
        end
      end

      if @plan.present?

        if current_user.stripe_customer_id.nil?
          flash[:notice] = I18n.t('something_went_wrong_with_the_credit_card_please_submit_it_again')
          redirect_to payment_path
          return
        end

        customer = Stripe::Customer.retrieve(current_user.stripe_customer_id)

        if @plan == 'cancel'
          if customer['subscriptions']['total_count'] > 0
            subscription = Stripe::Subscription.retrieve(customer['subscriptions']['data'][0]['id'])
            subscription.delete
          end
        elsif customer['subscriptions']['total_count'] == 0 && @plan.to_i > 1
          plan = get_stripe_plan(@plan, new_subscription_path)

          return if plan == false

          Stripe::Subscription.create(
            customer: customer.id,
            plan: plan.id
          )
        else
          current_plan = customer['subscriptions']['data'][0]['plan']['amount'] / 100

          if @plan != current_plan
            subscription = Stripe::Subscription.retrieve(customer['subscriptions']['data'][0]['id'])
            stripe_plan = get_stripe_plan(@plan, new_subscription_path)

            return if stripe_plan == false

            subscription.plan = stripe_plan['id']
            subscription.prorate = false
            subscription.save
          end
        end
      end

      if !params[:stripeSource].nil? || !params[:user][:plan].nil?
        flash[:notice] = I18n.t('your_payment_details_have_been_updated')
        redirect_to payment_path
        return
      end

      params[:user][:country] = nil if params[:user][:country] == ''

      super
    end

    # DELETE /resource
    # def destroy
    #   super
    # end

    # GET /resource/cancel
    # Forces the session data which is usually expired after sign
    # in to be expired now. This is useful if the user wants to
    # cancel oauth signing in/up in the middle of the process,
    # removing all OAuth session data.
    # def cancel
    #   super
    # end

    protected

    # If you have extra params to permit, append them to the sanitizer.
    # def configure_sign_up_params
    #   devise_parameter_sanitizer.permit(:sign_up, keys: [:attribute])
    # end

    # If you have extra params to permit, append them to the sanitizer.
    # def configure_account_update_params
    #   devise_parameter_sanitizer.permit(:account_update, keys: [:attribute])
    # end

    # The path used after sign up.
    def after_sign_up_path_for(_resource)
      dashboard_index_path + '?registered=1'
    end

    # The path used after sign up for inactive accounts.
    # def after_inactive_sign_up_path_for(resource)
    #   super(resource)
    # end

    def update_resource(resource, params)
      resource.update_without_password(params)
    end

    def get_stripe_plan(plan, error_path)
      plan_id = generate_plan_id(plan)
      product_name = generate_product_name(plan)

      begin
        stripe_plan = Stripe::Plan.retrieve(plan_id)
      rescue Stripe::StripeError
        begin
          stripe_plan = Stripe::Plan.create(
            id: plan_id,
            interval: 'month',
            currency: currency_for_user,
            amount: (plan.to_f * 100).round,
            product: {
              name: product_name
            }
          )
        rescue Stripe::StripeError => e
          flash[:error] = e.message
          redirect_to error_path
          return false
        end
      end
      stripe_plan
    end

    def generate_plan_id(plan)
      'climate_offset_' + plan.to_s.gsub(/[.,]/, '_') + '_' + currency_for_user + '_monthly'
    end

    def generate_product_name(plan)
      'Climate Offset ' + plan.to_s + ' ' + currency_for_user + ' Monthly'
    end
  end
end
