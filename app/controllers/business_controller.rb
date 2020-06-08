# frozen_string_literal: true

class BusinessController < ApplicationController
  def show
    @cost_per_tonne = cost_per_tonne
  end
end
