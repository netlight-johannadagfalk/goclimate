# frozen_string_literal: true

class PartnersController < ApplicationController
  def bokanerja
    @projects = Invoice.where(receiver: 'BokaNerja.S.L.').order(created_at: :desc).map(&:project)
  end

  def inshapetravel
    @projects = Invoice.where(receiver: 'InShape Travel').order(created_at: :desc).map(&:project)
  end

  def aob_travel
    @projects = Invoice.where(receiver: 'AOB Travel AB').order(created_at: :desc).map(&:project)
  end
end
