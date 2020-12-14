# frozen_string_literal: true

class NewsletterSubscriber < ApplicationRecord
  validates :email, email: true, presence: true
end
