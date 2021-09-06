# frozen_string_literal: true

module Admin
  class UsersController < AdminController
    before_action :set_user, only: [:show, :cancel_subscription, :destroy]

    MIN_CHARS_IN_SEARCH_QUERY = 3

    def index
      @max_entries = 30
      if params[:search_query].present? && params[:search_query].length < MIN_CHARS_IN_SEARCH_QUERY
        redirect_to admin_users_path, notice: "Please search with at least #{MIN_CHARS_IN_SEARCH_QUERY} characters"
        return
      end

      @users = users_from_search(params[:search_query], @max_entries)
    end

    def show
      @total_number_of_footprints = LifestyleFootprint.where(user_id: @user.id).count
    end

    def search
      if search_params[:search_query].present? && search_params[:search_query].length >= MIN_CHARS_IN_SEARCH_QUERY
        redirect_to admin_users_path(search_params)
      else
        redirect_to admin_users_path, notice: "Please search with at least #{MIN_CHARS_IN_SEARCH_QUERY} characters"
      end
    end

    def cancel_subscription
      subscription_manager = Subscriptions::StripeSubscriptionManager.new(@user)

      notice = if @user.active_subscription? && subscription_manager.cancel
                 'Subscription successfully cancelled'
               else
                 "Oups! Something went wrong! #{subscription_manager.errors.full_messages}"
               end

      redirect_to admin_user_path(@user.id), notice: notice
    end

    def destroy
      notice = if @user.deactivate
                 'Account deactivated'
               else
                 "Oups, something went wrong! #{@user.errors.full_messages}"
               end

      redirect_to admin_users_path, notice: notice
    end

    private

    def set_user
      @user = User.find(params[:id])
    end

    def search_params
      params.permit(:search_query)
    end

    def users_from_search(query, max_entries)
      return [] if query.blank?

      User.search_email(query, max_entries)
    end
  end
end
