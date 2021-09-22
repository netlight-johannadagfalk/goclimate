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

    if params[:newsletter_type] == NewsletterSubscriber::BUSINESS_TYPE
      NewsletterMailer.business_newsletter_signup_email(params[:newsletter_email]).deliver_now
    else
      NewsletterMailer.newsletter_signup_email(params[:newsletter_email]).deliver_now
    end

    head :ok
  end
end
