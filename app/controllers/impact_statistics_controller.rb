# frozen_string_literal: true

class ImpactStatisticsController < ApplicationController
  def show
    statistics = ImpactStatistics.new
    send_data statistics.to_csv, type: Mime[:csv]
  end
end
