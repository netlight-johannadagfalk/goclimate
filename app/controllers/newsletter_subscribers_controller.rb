# frozen_string_literal: true

class NewsletterSubscribersController < ApplicationController
  def create
    params.require(:newsletter_email)
    params.permit(:newsletter_email, :user_id, :region, :newsletter_type)
    subscriber = NewsletterSubscriber.new(
      email: params[:newsletter_email],
      user_id: params[:user_id],
      region: params[:region],
      newsletter_type: params[:newsletter_type]
    )

    unless subscriber.save
      render(status: :bad_request, json: { status: 400, errors: subscriber.errors })
      return
    end

    head :ok
  end
end
