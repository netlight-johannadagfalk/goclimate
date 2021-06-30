class ActionCategoriesController < ApplicationController
  before_action :set_action_category, only: %i[ show edit update destroy ]

  # GET /action_categories or /action_categories.json
  def index
    @action_categories = ActionCategory.all
  end

  # GET /action_categories/1 or /action_categories/1.json
  def show
  end

  # GET /action_categories/new
  def new
    @action_category = ActionCategory.new
  end

  # GET /action_categories/1/edit
  def edit
  end

  # POST /action_categories or /action_categories.json
  def create
    @action_category = ActionCategory.new(action_category_params)

    respond_to do |format|
      if @action_category.save
        format.html { redirect_to @action_category, notice: "Action category was successfully created." }
        format.json { render :show, status: :created, location: @action_category }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @action_category.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /action_categories/1 or /action_categories/1.json
  def update
    respond_to do |format|
      if @action_category.update(action_category_params)
        format.html { redirect_to @action_category, notice: "Action category was successfully updated." }
        format.json { render :show, status: :ok, location: @action_category }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @action_category.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /action_categories/1 or /action_categories/1.json
  def destroy
    @action_category.destroy
    respond_to do |format|
      format.html { redirect_to action_categories_url, notice: "Action category was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_action_category
      @action_category = ActionCategory.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def action_category_params
      params.require(:action_category).permit(:id, :name, :description)
    end
end
