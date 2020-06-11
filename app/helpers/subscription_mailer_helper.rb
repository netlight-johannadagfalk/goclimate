# frozen_string_literal: true

module SubscriptionMailerHelper
  def facebook_share_url(user)
    user_url(user, share: 'fb')
  end

  def twitter_share_url(user)
    user_url(user, share: 'tw')
  end
end
