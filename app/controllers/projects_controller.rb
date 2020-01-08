# frozen_string_literal: true

class ProjectsController < ApplicationController
  def index
    @projects = Project.all.order(date_bought: :desc)
    @latest_project = @projects.to_a.first
  end
end
