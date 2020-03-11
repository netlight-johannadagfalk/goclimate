# frozen_string_literal: true

module Admin
  class AdminController < ApplicationController
    layout 'admin'

    before_action :authorize_user
    before_action :permit_params_locale
    around_action :set_time_zone

    private

    def authorize_user
      render_not_found unless current_user && [2, 4, 129, 3994, 4686, 2670].include?(current_user.id)
    end

    def set_time_zone(&block) # rubocop:disable Naming/AccessorMethodName
      Time.use_zone('Europe/Stockholm', &block)
    end
  end
end
