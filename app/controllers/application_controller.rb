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
    I18n.locale = params[:locale] || I18n.default_locale
    if request.host.include? "en.goclimateneutral.org"
      I18n.locale = :en
    end
  end

  def after_sign_in_path_for(resource)
    dashboard_index_path
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
