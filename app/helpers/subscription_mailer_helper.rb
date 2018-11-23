# frozen_string_literal: true

module SubscriptionMailerHelper
  def months(count)
    if count == 1
      t('month')
    else
      t('months')
    end
  end

  def years(count)
    if count == 1
      t('year')
    else
      t('years')
    end
  end

  def facebook_share_url(user)
    I18n.t('goclimateneutral_url') + 'users/' + user.id.to_s + '?share=fb'
  end

  def twitter_share_url(user)
    I18n.t('goclimateneutral_url') + 'users/' + user.id.to_s + '?share=tw'
  end
end
