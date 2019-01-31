# frozen_string_literal: true

module Admin
  class AdminController < ApplicationController
    layout 'admin'

    before_action do
      render_not_found unless current_user && [2, 4, 129].include?(current_user.id)
    end
  end
end
