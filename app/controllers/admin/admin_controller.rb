# frozen_string_literal: true

module Admin
  class AdminController < ApplicationController
    before_action :authenticate_user!
    before_action do
      redirect_to new_user_session_path unless current_user && (current_user.id == 2 || current_user == 129)
    end
  end
end
