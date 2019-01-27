# frozen_string_literal: true

module Admin
  class AdminController < ApplicationController
    layout "admin"
    before_action do
      render_not_found unless current_user && (current_user.id == 2 || current_user == 129 || current_user == 4)
    end
  end
end
