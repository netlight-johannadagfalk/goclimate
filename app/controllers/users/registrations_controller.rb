# frozen_string_literal: true

require 'subscription_sign_up'
require 'three_d_secure_verification'

module Users
  class RegistrationsController < Devise::RegistrationsController
    # before_action :configure_sign_up_params, only: [:create]
    # before_action :configure_account_update_params, only: [:update]

    prepend_before_action :authenticate_scope!, only: [:edit, :update, :destroy, :payment]

    before_action :ensure_valid_new_params, only: [:new]
    before_action :ensure_valid_create_params, only: [:create]

    # GET /resource/sign_up
    def new
      @plan = LifestyleChoice.stripe_plan(params[:choices])
      @currency = currency_for_user

      super
    end

    # POST /resource
    def create
      user = self.resource = User.new(sign_up_params)

      # Don't wait until after we've charged to figure out that the User record is invalid
      render_errors && return unless user.valid?

      @plan = LifestyleChoice.stripe_plan(choices_params)
      plan = Stripe::Plan.retrieve_or_create_climate_offset_plan(@plan, currency_for_user)

      if params[:threeDSecure] == 'required' && (verification = create_three_d_secure_verification(plan)).verification_required?
        session[:three_d_secure_handoff] = three_d_secure_handoff_hash
        redirect_to verification.redirect_url
        return
      end

      @sign_up = SubscriptionSignUp.new(plan, card_source_param, user.email)
      @sign_up.three_d_secure_source = params['source'] if params['three_d_secure'] == 'continue'

      render_errors && return unless @sign_up.sign_up

      user.stripe_customer_id = @sign_up.customer.id
      user.lifestyle_choice_ids = choices_params.split(',').map(&:to_i)

      # User is validated at the top of this method, so a failure here, after
      # we charged, is considered exceptional.
      user.save!

      set_flash_message!(:notice, :signed_up)
      sign_up(resource_name, user)

      redirect_to after_sign_up_path_for(user)

      session.delete(:three_d_secure_handoff)
    end

    # GET /resource/edit
    def edit
      super
    end

    # PUT /resource
    def update
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
      dashboard_path + '?registered=1'
    end

    def after_update_path_for(_resource)
      edit_user_registration_path
    end

    # The path used after sign up for inactive accounts.
    # def after_inactive_sign_up_path_for(resource)
    #   super(resource)
    # end

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
      return unless choices_params.nil? && choices_params.match(/\d+,\d+,\d+,\d/).nil?

      flash[:error] = I18n.t('something_went_wrong_go_back_one_step_and_try_again')
      redirect_to new_user_registration_path(choices: params[:user][:choices])
    end

    def sign_up_params
      session.to_hash.dig('three_d_secure_handoff', 'sign_up_params') || super
    end

    def choices_params
      session.to_hash.dig('three_d_secure_handoff', 'choices') || params[:user][:choices]
    end

    def card_source_param
      session.to_hash.dig('three_d_secure_handoff', 'card_source') || params[:stripeSource]
    end

    def three_d_secure_handoff_hash
      {
        'sign_up_params' => sign_up_params,
        'choices' => choices_params,
        'card_source' => card_source_param
      }
    end

    def create_three_d_secure_verification(plan)
      ThreeDSecureVerification.new(
        card_source_param,
        plan.amount,
        plan.currency,
        user_registration_threedsecure_url
      )
    end
  end
end
