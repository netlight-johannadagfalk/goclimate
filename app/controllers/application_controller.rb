# frozen_string_literal: true

class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :set_locale

  def url_options
    # API runs on a separate subdomain in production, so make sure the default
    # subdomain is always `www` for route helpers
    return { subdomain: 'www' }.merge(super) if ENV['HEROKU_ENV'] == 'production'

    super
  end

  def render_not_found
    raise ActionController::RoutingError, 'Not found'
  end

  def set_locale
    I18n.locale =
      if params[:locale].present?
        params[:locale]
      elsif request.host.include?('en.goclimateneutral.org')
        :en
      elsif request.host.include?('de.goclimateneutral.org')
        :de
      elsif request.host.include?('sv.goclimateneutral.org')
        :sv
      else
        http_accept_language.compatible_language_from(I18n.available_locales)
      end
  end

  def after_sign_in_path_for(*)
    session['user_return_to'] || dashboard_path
  end

  def blog
    redirect_to "https://www.goclimateneutral.org/blog#{request.fullpath.gsub('/blog', '')}", status: :moved_permanently
  end

  def currency_for_user
    if user_signed_in? && !current_user.stripe_events.first.nil?
      current_user.currency
    elsif I18n.locale == :sv
      'sek'
    elsif I18n.locale == :en
      'usd'
    elsif I18n.locale == :de
      'eur'
    end
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:stripe_customer_id, :user_name, :country])
    devise_parameter_sanitizer.permit(:account_update, keys: [:user_name, :country])
  end
end
