# frozen_string_literal: true

module Admin
  class UsersController < AdminController
    def index
      @max_entries = 30
      if params[:search_query]
        if params[:search_query].length >= min_chars_in_search_query
          @users = User.search_email(params[:search_query], @max_entries)
        else
          redirect_to admin_users_path, notice: "Please search with at least #{min_chars_in_search_query} characters"
        end
      else
        @users = []
      end
    end

    def show
      @user = User.find(params[:id])
    end

    def search
      if search_params[:search_query].length >= min_chars_in_search_query
        redirect_to admin_users_path(search_params)
      else
        redirect_to admin_users_path, notice: "Please search with at least #{min_chars_in_search_query} characters"
      end
    end

    private

    def search_params
      params.permit(:search_query)
    end

    def min_chars_in_search_query
      3
    end
  end
end
