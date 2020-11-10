# frozen_string_literal: true

module DashboardHelper
  def encoded_social_quote(my_neutral_months)
    quote = I18n.t('i_have_lived_climate_neutral_for_join_me', count: my_neutral_months)
    CGI.escape("#{quote} -> #{root_url}")
  end

  def encoded_social_quote_without_subscription_months
    CGI.escape("#{t('share_quote_without_months')} #{root_url}")
  end

  def handle_encoded_social_quote(show_months, number_of_months)
    return encoded_social_quote(number_of_months) if show_months

    encoded_social_quote_without_subscription_months
  end
end
