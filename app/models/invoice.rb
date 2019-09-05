# frozen_string_literal: true

class Invoice < ApplicationRecord
  belongs_to :project

  # TODO: Make this the persisted value (in kgs) instead of carbon offset (in
  # tonnes) to standardize on using the term co2e in kgs for all GHG amounts
  def co2e
    carbon_offset * 1000
  end
end
