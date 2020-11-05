# frozen_string_literal: true

module UsersHelper
  def social_quote_for(name, neutral_months)
    if name.blank?
      I18n.t('i_have_lived_climate_neutral_for_join_me', count: neutral_months)
    else
      I18n.t('name_have_lived_climate_neutral_for_join_me', count: neutral_months, name: name)
    end
  end

  def handle_social_quote_for(name, show_months, number_of_months)
    return social_quote_for(name, number_of_months) if show_months

    t('share_quote_without_months')
  end

  def encoded_social_quote_for(name, neutral_months)
    CGI.escape("#{social_quote_for(name, neutral_months)} -> #{root_url}")
  end

  def handle_encoded_social_quote_for(name, show_months, number_of_months)
    return encoded_social_quote_for(name, number_of_months) if show_months

    encoded_social_quote_without_subscription_months
  end
end
