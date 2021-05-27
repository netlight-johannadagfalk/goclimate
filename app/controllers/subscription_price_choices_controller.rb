# frozen_string_literal: true

class SubscriptionPriceChoicesController < ApplicationController
  before_action :authenticate_user!

  def new
    @current_plan = current_user.current_plan
  end

  def create
  end
end
