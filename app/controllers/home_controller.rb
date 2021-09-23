# frozen_string_literal: true

class HomeController < ApplicationController
  def show
    @total_users = User.count
    @total_carbon_offset = OffsettingStatistics.new.total_sold.tonnes.round
    @latest_project = Project.order(date_bought: :desc).first
  end
end
