module Admin
  class ClimateActionsController < AdminController
    before_action :set_climate_action, only: %i[ show edit update destroy delete]

    # POST /climate_actions/filter
    def filter
      show_actions_filtered_on_categories_and_points(params[:category], params[:points])
    end

    #These functions filters actions based on input category and points
    def show_actions_filtered_on_categories_and_points(input_category, input_points)
      if (input_category.nil? || input_category.eql?('')) && (input_points.nil?)
        @climate_actions = ClimateAction.all
      else
        actionsFilteredBasedOnCategory = filter_actions_based_on_category(input_category)
        @climate_actions = filter_actions_based_on_points(input_points, actionsFilteredBasedOnCategory)
      end
    end

    #Filter actions based on categories
    def filter_actions_based_on_category(input_category)
      if input_category.nil? || input_category.eql?('')
        @climate_actions = ClimateAction.all
      else
        @climate_actions = ClimateAction.where(climate_action_category_id: input_category).select("*")
      end
    end

    #Filter actions based on points
    def filter_actions_based_on_points(input_points, actionsFilteredBasedOnCategory)
      if input_points.nil? || input_points.eql?('')
        @climate_actions = actionsFilteredBasedOnCategory
      else
        @climate_actions = actionsFilteredBasedOnCategory.where(points: input_points).select("*")
      end
    end

    # GET /climate_actions or /climate_actions.json
    def index
    #@climate_actions = ClimateAction.all
      show_actions_filtered_on_categories_and_points(params[:category], params[:points])
    end

    # GET /climate_actions/1 or /climate_actions/1.json
    def show
    end

    # GET /climate_actions/new
    def new
      @climate_action = ClimateAction.new
    end

    # GET /climate_actions/1/edit
    def edit
    end

    # POST /climate_actions or /climate_actions.json
    def create
      @climate_action = ClimateAction.new(climate_action_params)
      respond_to do |format|
        if @climate_action.save
          format.html { redirect_to [:admin, @climate_action], notice: "Climate action was successfully created." }
          format.json { render :show, status: :created, location: @climate_action }
        else
          format.html { render :new, status: :unprocessable_entity }
          format.json { render json: @climate_action.errors, status: :unprocessable_entity }
        end
      end
    end

    # PATCH/PUT /climate_actions/1 or /climate_actions/1.json
    def update
      respond_to do |format|
        if @climate_action.update(climate_action_params)
          format.html { redirect_to [:admin, @climate_action], notice: "Climate action was successfully updated." }
          format.json { render :show, status: :ok, location: @climate_action }
        else
          format.html { render :edit, status: :unprocessable_entity }
          format.json { render json: @climate_action.errors, status: :unprocessable_entity }
        end
      end
    end

    # DELETE /climate_actions/1 or /climate_actions/1.json
    def destroy
      @climate_action.destroy
      respond_to do |format|
        format.html { redirect_to admin_climate_actions_url, notice: "Climate action was successfully destroyed." }
        format.json { head :no_content }
      end
    end

    private
      # Use callbacks to share common setup or constraints between actions.
      def set_climate_action
        @climate_action = ClimateAction.find(params[:id])
      end

      # Only allow a list of trusted parameters through.
      def climate_action_params
        params.require(:climate_action).permit(:id, :name, :description, :points, :repeatable, :action_of_the_month, :climate_action_category_id)
      end
  end

end