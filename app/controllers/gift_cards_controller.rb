class GiftCardsController < ApplicationController
  def index
  end

  def new
    @subscription_months_to_gift = params[:subscription_months_to_gift]
  end

  def create
  end
end
