# frozen_string_literal: true

module SubscriptionMailerHelper
  def facebook_share_url(user)
    I18n.t('goclimateneutral_url') + 'users/' + user.id.to_s + '?share=fb'
  end

  def twitter_share_url(user)
    I18n.t('goclimateneutral_url') + 'users/' + user.id.to_s + '?share=tw'
  end
end
