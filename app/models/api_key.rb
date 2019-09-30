# frozen_string_literal: true

class ApiKey < ApplicationRecord
  validates :key, uniqueness: true, format: { with: /\A[a-f0-9]{24}\z/ }
  validates :contact_email, email: true, presence: true
  validates_presence_of :name, :usage_description, :contact_name

  before_validation :generate_key

  private

  def generate_key
    self.key = SecureRandom.hex(12) unless key.present?
  end
end
