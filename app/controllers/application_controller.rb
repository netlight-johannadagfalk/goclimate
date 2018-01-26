class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :set_locale
  after_action :set_last_seen_at, if: proc { user_signed_in? }

  unless Rails.application.config.consider_all_requests_local
    rescue_from ActionController::RoutingError, with: -> { render_404  }
  end

  def render_404
    respond_to do |format|
      format.html { render template: 'errors/not_found', status: 404 }
      format.all { render nothing: true, status: 404 }
    end
  end

  def set_locale

    I18n.locale = I18n.default_locale
    
    if !request.env['HTTP_ACCEPT_LANGUAGE'].nil? && request.env['HTTP_ACCEPT_LANGUAGE'].include?("sv")
      I18n.locale = :sv
    end

    if request.host.include? "en.goclimateneutral.org"
      I18n.locale = :en
    elsif request.host.include? "de.goclimateneutral.org"
      I18n.locale = :de
    elsif request.host.include? "sv.goclimateneutral.org"
      I18n.locale = :sv
    end

    if !params[:locale].nil?
      I18n.locale = params[:locale]
    end

    logger.debug "host: " + request.host
    logger.debug "locale: " + I18n.locale.to_s

  end

  def after_sign_in_path_for(resource)
    session["user_return_to"] || dashboard_index_path
  end

  def blog
    redirect_to "https://www.goclimateneutral.org/blog#{request.fullpath.gsub('/blog','')}", :status => :moved_permanently
  end

  def currency_for_user
    if user_signed_in? && !current_user.stripe_events.first.nil?
      currency = current_user.currency
    else
      currency = I18n.locale == :sv ? "sek" : "usd"
    end
    currency
  end

  def set_plan_data
    @lifestyle_choice_co2 = LifestyleChoice.get_lifestyle_choice_co2
    gon.lifestyle_choice_co2 = @lifestyle_choice_co2
    gon.locale = I18n.locale
    gon.SEK_PER_TONNE = LifestyleChoice::SEK_PER_TONNE
    gon.BUFFER_SIZE = LifestyleChoice::BUFFER_SIZE
    gon.SEK_PER_DOLLAR = LifestyleChoice::SEK_PER_DOLLAR
    gon.price_info_popup_content = I18n.t('price_info_popup_content')
  end

  protected
  
  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:stripe_customer_id, :user_name, :country])
    devise_parameter_sanitizer.permit(:account_update, keys: [:user_name, :country])
  end

  private

  def set_last_seen_at
    current_user.update_attribute(:last_seen_at, Time.now)
  end
end
