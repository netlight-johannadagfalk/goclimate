# frozen_string_literal: true

class Invoice < ApplicationRecord
  belongs_to :project, optional: true
  validates :certificate_reciever_email, email: true

  def self.co2e_per_month
    group("CONCAT((EXTRACT(YEAR FROM created_at)), '-', LPAD(EXTRACT(MONTH FROM created_at)::text, 2, '0'))")
      .sum('co2e')
  end
end
