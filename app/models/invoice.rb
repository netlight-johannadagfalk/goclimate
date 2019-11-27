# frozen_string_literal: true

class Invoice < ApplicationRecord
  belongs_to :project
  validates :certificate_reciever_email, email: true
end
