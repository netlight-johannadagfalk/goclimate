# frozen_string_literal: true

module Api
  class ApiKeysController < ApplicationController
    layout 'api_documentation'

    before_action :set_api_key, only: [:show]

    def new
      @api_key = ApiKey.new
    end

    def create
      @api_key = ApiKey.new(api_key_params)

      render(:new) && return unless @api_key.save

      ApiKeyMailer.with(api_key: @api_key).api_key_email.deliver_now
    end

    private

    # Use callbacks to share common setup or constraints between actions.
    def set_api_key
      @api_key = ApiKey.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def api_key_params
      params.require(:api_key).permit(:name, :usage_description, :contact_name, :contact_email)
    end
  end
end
