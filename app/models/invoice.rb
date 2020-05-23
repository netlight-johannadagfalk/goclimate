# frozen_string_literal: true

class Invoice < ApplicationRecord
  belongs_to :project, optional: true
  validates :certificate_reciever_email, email: true
end
