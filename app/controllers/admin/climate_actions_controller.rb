module Admin
  class ClimateActionsController < AdminController
    before_action :set_climate_action, only: %i[ show edit update destroy delete]

    # POST /climate_actions/filter
    # These functions handles the filtering of actions depending on category
    def filter
      show_actions_filtered_on_categories(params[:category])
    end

    def show_actions_filtered_on_categories(input_category)
      if input_category.nil? || input_category.eql?('')
        @climate_actions = ClimateAction.all
      else
        @climate_actions = ClimateAction.where(climate_action_category_id: input_category).select("*")
      end
    end
    
    # GET /climate_actions or /climate_actions.json
    def index
    #@climate_actions = ClimateAction.all
      show_actions_filtered_on_categories(params[:category])
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