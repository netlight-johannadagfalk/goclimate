# frozen_string_literal: true

module Users
  class RegistrationsController < Devise::RegistrationsController # rubocop:disable Metrics/ClassLength
    before_action :set_footprint_and_price, only: [:new, :create]
    before_action :set_user, only: [:create]
    before_action :set_subscription_manager, only: [:create]
    skip_before_action :require_no_authentication, only: [:create]

    # GET /resource/sign_up
    def new
      @user = User.new(region: current_region.id)

      @projects = Project.order(id: :desc).limit(3)
      @country_average = LifestyleFootprintAverage.find_by_country(@footprint.country)

      respond_to do |format|
        format.html { render params[:campaign].presence ? 'new_campaign' : 'new' }
        format.json { render_price_json }
      end
    end

    # POST /resource
    #
    # This gets posted to from Javascript and can be retried after errors at
    # multiple points, hence lots of guards for different cases here.
    #
    # Rubocop warnings disabled because the "but no simpler" part of that
    # Einstein quote "As simple as possible, but no simpler".
    def create # rubocop:disable Metrics/MethodLength
      render_user_invalid_json && return unless @user.save

      @user.create_stripe_customer
      sign_in(resource_name, @user, force: true) # Force because we have updated the password

      unless params[:membership] == 'free'
        stripe_plan = @plan.retrieve_or_create_stripe_plan
        @manager.sign_up(
          stripe_plan,
          params[:payment_method_id],
          Subscriptions::ReferralCode.find_by_code(params[:referral_code])
        )
      end

      if @manager.errors.any?
        render_signup_failed_json
      elsif @manager.confirmation_required?
        send_welcome_email
        render_confirmation_required_json
      else
        send_welcome_email
        render_success_json
      end
    rescue StandardError => e
      # Respond explicitly so cookies gets set in responses where a user record
      # has been created that we want to reuse.
      logger.error(e)
      Raven.capture_exception(e)
      head :internal_server_error
    end

    # PUT /resource
    def update
      params[:user][:country] = nil if params[:user][:country] == ''

      super
    end

    protected

    # The path used after sign up.
    def after_sign_up_path_for(_resource)
      return dashboard_path(registered: 1) if params[:membership] == 'free'

      dashboard_path(subscribed: 1)
    end

    def after_update_path_for(_resource)
      edit_user_registration_path
    end

    def update_resource(resource, params)
      resource.update_without_password(params)
    end

    def sign_up_params
      super.merge(
        lifestyle_footprint_ids: [@footprint&.id]
      )
    end

    def canonical_query_params
      super + [:choices]
    end

    private

    def send_welcome_email
      WelcomeMailer.with(email: @user.email).welcome_email.deliver_now
    end

    def set_footprint_and_price
      @footprint = LifestyleFootprint.find_by_key!(params[:lifestyle_footprint])

      unless footprint_present_and_usable_by_current_user?
        redirect_to root_url
        return
      end

      @footprint_tonnes = @footprint&.total
      number_of_people = params[:membership] == 'multi' && params[:people].present? ? params[:people].to_i : 1
      @plan = Subscriptions::Plan.for_footprint(@footprint_tonnes * number_of_people, current_region.currency)
    end

    def footprint_present_and_usable_by_current_user?
      @footprint.present? &&
        (@footprint.user_id.nil? || current_user.present? && @footprint.user_id == current_user.id)
    end

    def set_user
      @user =
        if current_user.present?
          current_user.tap { |u| u.attributes = sign_up_params }
        else
          User.new(sign_up_params)
        end
    end

    def set_subscription_manager
      @manager = Subscriptions::StripeSubscriptionManager.new(@user)
    end

    def render_price_json
      render json: {
        subscription: @plan.footprint.to_s(unit: :tonnes),
        price: @plan.price.to_s(precision: :auto)
      }
    end

    def render_user_invalid_json
      render status: :bad_request, json: error_json(@user.errors.full_messages.join(', '))
    end

    def render_signup_failed_json
      render status: :bad_request, json: error_json(@manager.errors.values.join(', '))
    end

    def render_confirmation_required_json
      render json: {
        next_step: 'confirmation_required',
        intent_type: @manager.intent_to_confirm.object,
        intent_client_secret: @manager.intent_to_confirm.client_secret,
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
