# frozen_string_literal: true

class NewsletterSubscribersController < ApplicationController
  def create
    params.require(:newsletter_email)
    params.permit(:logged_in_user_id, :region)
    subscriber = NewsletterSubscriber.new(
      email: params[:newsletter_email],
      logged_in_user_id: params[:logged_in_user_id],
      region: params[:region]
    )

    if subscriber.save
      head :ok
    else
      render(
        status: :bad_request,
        json: { error: { message: 'email' } }
      )
    end
  end
end
