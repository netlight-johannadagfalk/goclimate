# frozen_string_literal: true

module Users
  class RegistrationsController < Devise::RegistrationsController
    prepend_before_action :authenticate_scope!, only: [:edit, :update, :destroy, :payment]

    before_action :ensure_valid_new_params, only: [:new]
    before_action :ensure_valid_create_params, only: [:create]
    before_action :ensure_valid_verify_params, only: [:verify]
    before_action :set_choices_for_new, only: [:new]
    before_action :set_choices_for_create, only: [:create, :verify]

    # GET /resource/sign_up
    def new
      @current_plan_price = LifestyleChoice.stripe_plan(params[:choices], currency_for_user)

      super
    end

    # POST /resource
    #
    # This action is doing lots of things due to the complexities of the sign
    # up process. Simplifying too much would make it harder to understand, so
    # we disable the Rubocop check Metrics/AbcSize instead.
    #
    # rubocop:disable Metrics/AbcSize
    def create
      user = self.resource = User.new(sign_up_params)

      render json: user.errors, status: :bad_request && return unless user.valid?(:precheck)

      @current_plan_price = LifestyleChoice.stripe_plan(choices_params, currency_for_user)
      stripe_plan = Stripe::Plan.retrieve_or_create_climate_offset_plan(@current_plan_price)

      @manager = SubscriptionManager.new

      if @manager.sign_up(user.email, stripe_plan, params[:paymentMethodId])
        finilize_registration(user)
      elsif @manager.payment_intent_client_secret
        # The card requires 3d secure step in the browser
        render_requires_3ds
      else
        render json: @manager.errors, status: :bad_request
      end
    end
    # rubocop:enable Metrics/AbcSize

    # POST /resource/verify
    def verify
      user = self.resource = User.new(sign_up_params)

      render json: user.errors, status: :bad_request && return unless user.valid?(:precheck)

      @manager = SubscriptionManager.for_customer(
        Stripe::Customer.retrieve(params[:stripeCustomerId]),
        Stripe::PaymentIntent.retrieve(params[:paymentIntentId])
      )

      finilize_registration(user)
    end

    # PUT /resource
    def update
      params[:user][:country] = nil if params[:user][:country] == ''

      super
    end

    protected

    def render_requires_3ds
      render json: {
        paymentIntentClientSecret: @manager.payment_intent_client_secret,
        stripeCustomerId: @manager.customer.id,
        verifyPath: user_registration_verify_path
      }, status: :ok
    end

    def finilize_registration(user)
      if @manager.payment_intent.status != 'succeeded'
        render json: { payment: I18n.t('payment_failed_try_again', status: @manager.payment_intent.status) },
               status: :bad_request
        return
      end
      user.stripe_customer_id = @manager.customer.id
      user.lifestyle_choice_ids = choices_params.split(',').map(&:to_i)

      # User is validated at the top of this method, so a failure here, after
      # we charged, is considered exceptional.
      user.save!

      set_flash_message!(:notice, :signed_up)
      sign_up(resource_name, user)

      render json: { redirectTo: after_sign_up_path_for(user) }, status: :created
    end

    # The path used after sign up.
    def after_sign_up_path_for(_resource)
      dashboard_path + '?registered=1'
    end

    def after_update_path_for(_resource)
      edit_user_registration_path
    end

    def update_resource(resource, params)
      resource.update_without_password(params)
    end

    private

    def render_errors
      resource.clean_up_passwords
      render :new
    end

    def ensure_valid_new_params
      redirect_to '/#choose-plan' if params[:choices].nil? || !params[:choices].include?(',')
    end

    def ensure_valid_create_params
      ensure_valid_create_verify_param(params[:paymentMethodId])
    end

    def ensure_valid_verify_params
      ensure_valid_create_verify_param(params[:paymentIntentId])
    end

    def ensure_valid_create_verify_param(required_param)
      return if choices_params&.match(/\d+,\d+,\d+,\d/) && required_param

      render json: { error: I18n.t('something_went_wrong_go_back_one_step_and_try_again') }, status: :bad_request
    end

    def set_choices_for_new
      @choices = params[:choices]
    end

    def set_choices_for_create
      @choices = choices_params
    end

    def choices_params
      params[:user][:choices]
    end
  end
end
