# frozen_string_literal: true

class GiftCardCertificate < ApplicationRecord
  validates :key, presence: true, uniqueness: true, format: { with: /[a-f0-9]{40}/ }
  validates_presence_of :number_of_months, :message
end
