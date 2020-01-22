# frozen_string_literal: true

module Users
  class RegistrationsController < Devise::RegistrationsController
    before_action :set_lifestyle_choice_ids, only: [:new, :create]
    before_action :set_user, only: [:create]
    before_action :set_stripe_plan, only: [:create]
    before_action :set_subscription_manager, only: [:create]
    skip_before_action :require_no_authentication, only: [:create]

    # GET /resource/sign_up
    def new
      @user = User.new(region: current_region.id)
      @current_plan_price = LifestyleChoice.get_lifestyle_choice_price(@lifestyle_choice_ids, current_region.currency)
    end

    # POST /resource
    #
    # This gets posted to from Javascript and can be retried after errors at
    # multiple points, hence lots of guards for different cases here.
    #
    # Rubocop warnings disabled because the "but no simpler" part of that
    # Einstein quote "As simple as possible, but no simpler".
    def create # rubocop:disable Metrics/AbcSize,Metrics/CyclomaticComplexity,Metrics/PerceivedComplexity
      render_user_invalid_json && return unless @user.save
      sign_in(resource_name, @user, force: true) # Force because we have updated the password

      @manager.sign_up(@user.email, @stripe_plan, params[:payment_method_id])

      if @manager.customer.present? && @user.stripe_customer_id != @manager.customer.id
        @user.update!(stripe_customer_id: @manager.customer.id)
      end

      if @manager.errors.any?
        render_signup_failed_json
      elsif @manager.payment_verification_required?
        render_verification_required_json
      else
        render_success_json
      end
    end

    # PUT /resource
    def update
      params[:user][:country] = nil if params[:user][:country] == ''

      super
    end

    protected

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

    def sign_up_params
      super.merge(lifestyle_choice_ids: @lifestyle_choice_ids)
    end

    def canonical_query_params
      super + [:choices]
    end

    private

    def set_lifestyle_choice_ids
      unless params[:choices]&.match(/\d+,\d+,\d+,\d/)
        respond_to do |format|
          format.html { redirect_to '/#choose-plan' }
          format.json do
            render status: 400,
                   json: error_json('Something went wrong. Please start over and try again.')
          end
        end
        return
      end

      @lifestyle_choice_ids = params[:choices].split(',').map(&:to_i)
    end

    def set_user
      @user =
        if current_user.present?
          current_user.tap { |u| u.attributes = sign_up_params }
        else
          User.new(sign_up_params)
        end
    end

    def set_stripe_plan
      plan_price = LifestyleChoice.get_lifestyle_choice_price(@lifestyle_choice_ids, @user.region.currency)
      @stripe_plan = Stripe::Plan.retrieve_or_create_climate_offset_plan(plan_price)
    end

    def set_subscription_manager
      @manager = SubscriptionManager.new(@user.stripe_customer)
    end

    def render_user_invalid_json
      render status: :bad_request, json: error_json(@user.errors.full_messages.join(', '))
    end

    def render_signup_failed_json
      render status: :bad_request, json: error_json(@manager.errors.values.join(', '))
    end

    def render_verification_required_json
      render json: {
        next_step: :verification_required,
        payment_intent_client_secret: @manager.latest_payment_intent.client_secret,
        success_url: after_sign_up_path_for(@user)
      }
    end

    def render_success_json
      render json: {
        next_step: :redirect,
        success_url: after_sign_up_path_for(@user)
      }
    end

    def error_json(message)
      { error: { message: message } }
    end
  end
end
