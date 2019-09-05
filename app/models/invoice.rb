# frozen_string_literal: true

class Invoice < ApplicationRecord
  belongs_to :project

  def co2e
    carbon_offset * 1000
  end
end
