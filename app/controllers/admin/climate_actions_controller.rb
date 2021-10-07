# frozen_string_literal: true

module Admin
  class ClimateActionsController < AdminController # rubocop:disable Metrics/ClassLength
    before_action :set_climate_action, only: [:show, :edit, :update, :destroy, :delete]

    def set_action_of_the_month
      ClimateAction.where.not(id: params[:id]).update_all(action_of_the_month: false)
      ClimateAction.where(id: params[:id]).update_all(action_of_the_month: true)
      @choose_climate_actions = ClimateAction.all
      @action_of_the_month = ClimateAction.where(action_of_the_month: true).first
      number_of_times_action_performed
      show_actions_filtered_on_categories_and_points(params[:category], params[:points])
    end

    def show_climate_actions
      @choose_climate_actions = ClimateAction.all
    end

    # POST /climate_actions/filter
    def filter
      show_actions_filtered_on_categories_and_points(params[:category], params[:points])
    end

    # These functions filters actions based on input category and points
    def show_actions_filtered_on_categories_and_points(input_category, input_points)
      if (input_category.nil? || input_category.eql?('')) && input_points.nil?
        @climate_actions = ClimateAction.all
      else
        actions_filtered_based_on_category = filter_actions_based_on_category(input_category)
        @climate_actions = filter_actions_based_on_points(input_points, actions_filtered_based_on_category)
      end
    end

    # Filter actions based on categories
    def filter_actions_based_on_category(input_category)
      @climate_actions = if input_category.nil? || input_category.eql?('')
                           ClimateAction.all
                         else
                           ClimateAction.where(climate_action_category_id: input_category).select('*')
                         end
    end

    # Filter actions based on points
    def filter_actions_based_on_points(input_points, actions_filtered_based_on_category)
      @climate_actions = if input_points.nil? || input_points.eql?('')
                           actions_filtered_based_on_category
                         else
                           actions_filtered_based_on_category.where(points: input_points).select('*')
                         end
    end

    def number_of_performed_users_actions_in_order
      @number_of_performed_users_actions_in_order =
        ClimateAction.joins(:user_climate_actions)
                     .select('climate_actions.*, count(user_climate_actions.climate_action_id) as total')
                     .order('COUNT(user_climate_actions.climate_action_id) DESC')
                     .group('climate_actions.id')
                     .limit(10)
    end

    # GET /climate_actions or /climate_actions.json
    def index
      @choose_climate_actions = ClimateAction.all
      @action_of_the_month = ClimateAction.where(action_of_the_month: true).first
      number_of_times_action_performed
      number_of_performed_users_actions_in_order
      show_actions_filtered_on_categories_and_points(params[:category], params[:points])
    end

    def number_of_times_action_performed
      @action_of_the_month_number_of_times_performed = if @action_of_the_month.nil?
                                                         nil
                                                       else
                                                         action_of_the_month_number_of_times_performed
                                                       end
    end

    # GET /climate_actions/1 or /climate_actions/1.json
    def show
      @climate_actions = ClimateAction.all
      @climate_actions_categories = ClimateActionCategory.all
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
          check_monthly_mail_update(@climate_action.id)
          format.html { redirect_to [:admin, @climate_action], notice: 'Climate action was successfully created.' }
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
          check_monthly_mail_update(@climate_action.id)
          format.html { redirect_to [:admin, @climate_action], notice: 'Climate action was successfully updated.' }
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
        format.html { redirect_to admin_climate_actions_url, notice: 'Climate action was successfully destroyed.' }
        format.json { head :no_content }
      end
    end

    private

    # Set all other actions to action_of_the_month false so no duplicates
    def check_monthly_mail_update(id)
      return unless ClimateAction.where(action_of_the_month: true).count > 1

      ClimateAction.where.not(id: id).update_all(action_of_the_month: false)
    end

    def action_of_the_month_number_of_times_performed
      UserClimateAction
        .where(climate_action_id: @action_of_the_month.id)
        .count
    end

    # Use callbacks to share common setup or constraints between actions.
    def set_climate_action
      @climate_action = ClimateAction.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def climate_action_params
      params.require(:climate_action).permit(:id, :name, :description, :points, :image_url, :repeatable,
                                             :action_of_the_month, :climate_action_category_id)
    end
  end
end
