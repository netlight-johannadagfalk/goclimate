class UserClimateActionsController < ApplicationController
  before_action :set_user_climate_action, only: %i[ show edit update destroy ]

  # GET /user_climate_actions or /user_climate_actions.json
  def index
    @user_climate_actions = UserClimateAction.all
  end

  # GET /user_climate_actions/1 or /user_climate_actions/1.json
  def show
  end

  # GET /user_climate_actions/new
  def new
    @user_climate_action = UserClimateAction.new
  end

  # GET /user_climate_actions/1/edit
  def edit
  end

  # POST /user_climate_actions or /user_climate_actions.json
  def create
    @user_climate_action = UserClimateAction.new(user_climate_action_params)

    respond_to do |format|
      if @user_climate_action.save
        format.html { redirect_to @user_climate_action, notice: "User climate action was successfully created." }
        format.json { render :show, status: :created, location: @user_climate_action }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @user_climate_action.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /user_climate_actions/1 or /user_climate_actions/1.json
  def update
    respond_to do |format|
      if @user_climate_action.update(user_climate_action_params)
        format.html { redirect_to @user_climate_action, notice: "User climate action was successfully updated." }
        format.json { render :show, status: :ok, location: @user_climate_action }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @user_climate_action.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /user_climate_actions/1 or /user_climate_actions/1.json
  def destroy
    @user_climate_action.destroy
    respond_to do |format|
      format.html { redirect_to user_climate_actions_url, notice: "User climate action was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user_climate_action
      @user_climate_action = UserClimateAction.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def user_climate_action_params
      params.require(:user_climate_action).permit(:user_id, :climate_action_id, :status)
    end
end
