# frozen_string_literal: true

module Business
  class ClimateReportsController < ApplicationController
    before_action :force_en_locale # Business pages are English only for now

    def show
      @projects = Project.order(id: :desc).limit(2)
    end

    def new
    end

    def create
      redirect_to action: :show, key: '123'
    end
  end
end
