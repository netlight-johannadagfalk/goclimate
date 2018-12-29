# frozen_string_literal: true

module DashboardHelper
  def encoded_social_quote(my_neutral_months)
    quote = I18n.t('i_have_lived_climate_neutral_for_join_me', count: my_neutral_months)
    CGI.escape("#{quote} -> #{I18n.t('goclimateneutral_url')}")
  end
end
