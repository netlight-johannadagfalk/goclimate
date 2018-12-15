class PartnersController < ApplicationController
  def bokanerja
    @projects = Project.order(date_bought: :desc).first(5)
  end
end
