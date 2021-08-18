# frozen_string_literal: true

module Admin
  class LifestyleFootprintsController < AdminController
    before_action :set_footprint, only: [:show, :destroy]

    def index
      @footprints = if params[:user_id].present?
                      LifestyleFootprint.where(user_id: params[:user_id]).order(created_at: :desc)
                    else
                      []
                    end
    end

    def show
    end

    def destroy
      user_id = @footprint.user_id
      @footprint.destroy
      flash[:notice] = I18n.t('views.lifestyle_footprints.show.delete_confirmation.success')
      redirect_to admin_lifestyle_footprints_path(user_id: user_id)
    end

    private

    def set_footprint
      @footprint = LifestyleFootprint.find(params[:id])
    end
  end
end
