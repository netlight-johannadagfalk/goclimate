# frozen_string_literal: true

class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :set_locale

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

  def force_sv_locale
    I18n.locale = :sv
  end

  def permit_params_locale
    I18n.locale = params[:locale] if params[:locale].present?
  end

  def force_en_locale
    I18n.locale = :en
  end

  def after_sign_in_path_for(*)
    session['user_return_to'] || dashboard_path
  end

  def blog
    redirect_to "https://www.goclimateneutral.org/blog#{request.fullpath.gsub('/blog', '')}", status: :moved_permanently
  end

  def currency_for_user
    if user_signed_in? && !current_user.stripe_events.first.nil?
      Currency.from_iso_code(current_user.currency)
    else
      Currency.from_locale(I18n.locale)
    end
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:stripe_customer_id, :user_name, :country])
    devise_parameter_sanitizer.permit(:account_update, keys: [:user_name, :country])
  end

  def cost_per_tonne
    case I18n.locale
    when :sv
      LifestyleChoice::BUSINESS_SEK_PER_TONNE
    when :en
      LifestyleChoice::BUSINESS_SEK_PER_TONNE / LifestyleChoice::SEK_PER_USD
    when :de
      LifestyleChoice::BUSINESS_SEK_PER_TONNE / LifestyleChoice::SEK_PER_EUR
    end
  end

  def handle_record_not_found
    render 'errors/not_found', status: :not_found
  end
end
