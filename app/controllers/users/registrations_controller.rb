# frozen_string_literal: true

require 'subscription_manager'
require 'three_d_secure_verification'

module Users
  class RegistrationsController < Devise::RegistrationsController
    # before_action :configure_sign_up_params, only: [:create]
    # before_action :configure_account_update_params, only: [:update]

    prepend_before_action :authenticate_scope!, only: [:edit, :update, :destroy, :payment]

    before_action :ensure_valid_new_params, only: [:new]
    before_action :ensure_valid_create_params, only: [:create]
    before_action :set_choices_for_new, only: [:new]
    before_action :set_choices_for_create, only: [:create]

    # Cleanup potential 3D Secure handoff hash before starting fresh, and also after returning.
    before_action :cleanup_three_d_secure_handoff, only: [:create], if: -> { params[:three_d_secure] != 'continue' }
    after_action :cleanup_three_d_secure_handoff, only: [:create], if: -> { params[:three_d_secure] == 'continue' }

    # GET /resource/sign_up
    def new
      @plan = LifestyleChoice.stripe_plan(params[:choices])
      @currency = currency_for_user

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

      # Don't wait until after we've charged to figure out that the User record is invalid
      render_errors && return unless user.valid?(:precheck)

      @plan = LifestyleChoice.stripe_plan(choices_params)
      plan = Stripe::Plan.retrieve_or_create_climate_offset_plan(@plan, currency_for_user)

      return if redirect_to_applicable_three_d_secure_verification(plan)

      @manager = SubscriptionManager.new

      render_errors && return unless sign_up_subscription(user, plan)

      user.stripe_customer_id = @manager.customer.id
      user.lifestyle_choice_ids = choices_params.split(',').map(&:to_i)

      # User is validated at the top of this method, so a failure here, after
      # we charged, is considered exceptional.
      user.save!

      set_flash_message!(:notice, :signed_up)
      sign_up(resource_name, user)

      redirect_to after_sign_up_path_for(user)
    end
    # rubocop:enable Metrics/AbcSize

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

    def redirect_to_applicable_three_d_secure_verification(plan)
      return false unless params[:threeDSecure] == 'required'

      verification = ThreeDSecureVerification.new(
        card_source_param, plan.amount, plan.currency, user_registration_threedsecure_url
      )
      return false unless verification.verification_required?

      set_three_d_secure_handoff
      redirect_to verification.redirect_url
      true
    end

    def sign_up_subscription(user, plan)
      @manager.sign_up(
        user.email, plan, card_source_param,
        params['three_d_secure'] == 'continue' ? params['source'] : nil
      )
    end

    def ensure_valid_new_params
      redirect_to '/#choose-plan' if params[:choices].nil? || !params[:choices].include?(',')
    end

    def ensure_valid_create_params
      return unless choices_params.nil? && choices_params.match(/\d+,\d+,\d+,\d/).nil?

      flash[:error] = I18n.t('something_went_wrong_go_back_one_step_and_try_again')
      redirect_to new_user_registration_path(choices: params[:user][:choices])
    end

    def set_choices_for_new
      @choices = params[:choices]
    end

    def set_choices_for_create
      @choices = choices_params
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

    def set_three_d_secure_handoff
      session[:three_d_secure_handoff] = {
        'sign_up_params' => sign_up_params,
        'choices' => choices_params,
        'card_source' => card_source_param
      }
    end

    def cleanup_three_d_secure_handoff
      session.delete(:three_d_secure_handoff)
    end
  end
end
