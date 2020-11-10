# frozen_string_literal: true

class ReferralCodesController < ApplicationController
  def show
    code = ReferralCode.where(code: params[:code]).where.not(destination_path: nil).take!

    redirect_to code.destination_path
  end

  def lookup
    code = ReferralCode.find_by!('LOWER(code) = ?', params[:code]&.downcase || '')

    render json: { code: code.code }
  rescue ActiveRecord::RecordNotFound
    head :not_found
  end
end
