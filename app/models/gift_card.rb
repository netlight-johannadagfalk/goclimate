# frozen_string_literal: true

require 'digest'

class GiftCard < ApplicationRecord
  validates :key, uniqueness: true, format: { with: /[a-f0-9]{40}/ }
  validates_presence_of :number_of_months

  before_validation :generate_key

  private

  def generate_key
    self.key = Digest::SHA1.hexdigest("#{Time.now}#{number_of_months}#{message}") unless key.present?
  end
end
