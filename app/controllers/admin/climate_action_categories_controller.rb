# frozen_string_literal: true

module Admin
  class ClimateActionCategoriesController < AdminController
    before_action :set_climate_action_category, only: [:show, :edit, :update, :destroy]

    # @check = ClimateAction.where(climate_action_category_id: 2)

    def check
      if ClimateAction.include?(climate_action_category_id: 2)
        true
      else
        false
      end
    end

    # GET /climate_action_categories or /climate_action_categories.json
    def index
      @climate_action_categories = ClimateActionCategory.all
    end

    # GET /climate_action_categories/1 or /climate_action_categories/1.json
    def show
    end

    # GET /climate_action_categories/new
    def new
      @climate_action_category = ClimateActionCategory.new
    end

    # GET /climate_action_categories/1/edit
    def edit
    end

    # POST /climate_action_categories or /climate_action_categories.json
    def create
      @climate_action_category = ClimateActionCategory.new(climate_action_category_params)

      respond_to do |format|
        if @climate_action_category.save
          format.html do
            redirect_to [:admin, @climate_action_category], notice: 'Climate action category was successfully created.'
          end
          format.json { render :show, status: :created, location: @climate_action_category }
        else
          format.html { render :new, status: :unprocessable_entity }
          format.json { render json: @climate_action_category.errors, status: :unprocessable_entity }
        end
      end
    end

    # PATCH/PUT /climate_action_categories/1 or /climate_action_categories/1.json
    def update
      respond_to do |format|
        if @climate_action_category.update(climate_action_category_params)
          format.html do
            redirect_to [:admin, @climate_action_category], notice: 'Climate action category was successfully updated.'
          end
          format.json { render :show, status: :ok, location: @climate_action_category }
        else
          format.html { render :edit, status: :unprocessable_entity }
          format.json { render json: @climate_action_category.errors, status: :unprocessable_entity }
        end
      end
    end

    # DELETE /climate_action_categories/1 or /climate_action_categories/1.json
    def destroy
      @climate_action_category.destroy
      respond_to do |format|
        format.html do
          redirect_to admin_climate_action_categories_url, notice: 'Climate action category was successfully destroyed.'
        end
        format.json { head :no_content }
      end
    end

    private

    # Use callbacks to share common setup or constraints between actions.
    def set_climate_action_category
      @climate_action_category = ClimateActionCategory.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def climate_action_category_params
      params.require(:climate_action_category).permit(:id, :name, :description, :badge_name, :badge_description,
                                                      :badge_image_url)
    end
  end
end
