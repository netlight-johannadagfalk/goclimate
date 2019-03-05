# frozen_string_literal: true

class PartnersController < ApplicationController
  def bokanerja
    @projects = Project.order(date_bought: :desc).first(5)
  end

  def inshapetravel
    @projects = Project.where(id: 18)
  end
end
