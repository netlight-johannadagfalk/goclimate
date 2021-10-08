# frozen_string_literal: true

module Admin
  class UnitsController < AdminController
    before_action :set_unit, only: [:show, :edit, :update, :destroy]

    def index
      @units = BusinessCalculators::Unit.all.order(name: :asc)
    end

    def show
    end

    def new
      @unit = BusinessCalculators::Unit.new
    end

    def edit
    end

    def create
      @unit = BusinessCalculators::Unit.new(unit_params)

      if @unit.save
        redirect_to [:admin, @unit], notice: 'Unit was successfully created.'
      else
        render :new
      end
    end

    def update
      if @unit.update(unit_params)
        redirect_to [:admin, @unit], notice: 'Unit was successfully updated.'
      else
        render :edit
      end
    end

    def destroy
      @unit.destroy

      redirect_to admin_units_url, notice: 'Unit was successfully destroyed.'
    end

    private

    def set_unit
      @unit = BusinessCalculators::Unit.find(params[:id])
    end

    def unit_params
      params.require(:unit).permit(:name, :key)
    end
  end
end
