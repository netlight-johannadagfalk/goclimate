# frozen_string_literal: true

class NewsletterSubscriber < ApplicationRecord
  belongs_to :user, optional: true

  validates :email, email: true, presence: true
  validate :correct_newsletter_type
  validate :user_id_exists
  validates_uniqueness_of :email, scope: [:newsletter_type], message: 'duplicate'

  scope :only_consumer, -> { where(newsletter_type: CONSUMER_TYPE) }
  scope :only_business, -> { where(newsletter_type: BUSINESS_TYPE) }

  CONSUMER_TYPE = 'consumer'
  BUSINESS_TYPE = 'business'
  NEWSLETTER_TYPES = [CONSUMER_TYPE, BUSINESS_TYPE].freeze

  private

  def correct_newsletter_type
    self.newsletter_type = 'consumer' if newsletter_type.blank?

    return if NEWSLETTER_TYPES.include?(newsletter_type)

    errors.add(:newsletter_type, "must be one of #{NEWSLETTER_TYPES.join(', ')}")
  end

  def user_id_exists
    return if user_id.blank?

    errors.add(:user, 'must exist') unless User.exists?(user_id)
  end
end
