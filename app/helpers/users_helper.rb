# frozen_string_literal: true

module UsersHelper
  def social_quote_for(name, neutral_months)
    if name.nil?
      I18n.t('i_have_lived_climate_neutral_for_join_me', count: neutral_months)
    else
      I18n.t('name_have_lived_climate_neutral_for_join_me', count: neutral_months, name: name)
    end
  end

  def encoded_social_quote_for(name, neutral_months)
    CGI.escape("#{social_quote_for(name, neutral_months)} -> #{root_url}")
  end
end
