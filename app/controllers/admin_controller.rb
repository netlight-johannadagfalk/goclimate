# frozen_string_literal: true

class AdminController < ApplicationController
  before_action :authenticate_user!
  before_action do
    redirect_to new_user_session_path unless current_user && (current_user.id == 2 || current_user == 129)
  end

  def index
    @total_co2_bought = Project.all.sum("carbon_offset")
    @total_co2_consumed = Project.total_carbon_offset
    @total_sek_spent = Project.all.sum("cost_in_sek")
    @payouts_in_sek = (StripePayout.sum(:amount) / 100) + Invoice.sum(:amount_in_sek)

    @new_users = {}
    User.group("date(created_at)").count.each do |date, number_of_users|
      @new_users[date.to_s] = number_of_users
    end
    @new_users.sort

    @new_users_mean = {}
    @new_users.each do |date, _|
      mean = 0
      (0..14).each do |i|
        if @new_users[(date.to_date - i).to_s].present?
          mean += @new_users[(date.to_date - i).to_s]
        end
      end
      mean /= 14
      @new_users_mean[date] = mean
    end
  end
end
