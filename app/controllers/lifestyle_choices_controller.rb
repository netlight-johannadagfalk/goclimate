# frozen_string_literal: true

class LifestyleChoicesController < ApplicationController
  before_action :set_lifestyle_choice, only: [:show, :edit, :update, :destroy]

  before_action :authenticate_user!
  before_action do
    redirect_to new_user_session_path unless current_user && current_user.id == 2
  end

  # GET /lifestyle_choices
  # GET /lifestyle_choices.json
  def index
    @lifestyle_choices = LifestyleChoice.all
  end

  # GET /lifestyle_choices/1
  # GET /lifestyle_choices/1.json
  def show
  end

  # GET /lifestyle_choices/new
  def new
    @lifestyle_choice = LifestyleChoice.new
  end

  # GET /lifestyle_choices/1/edit
  def edit
  end

  # POST /lifestyle_choices
  # POST /lifestyle_choices.json
  def create
    @lifestyle_choice = LifestyleChoice.new(lifestyle_choice_params)

    respond_to do |format|
      if @lifestyle_choice.save
        format.html { redirect_to @lifestyle_choice, notice: 'Lifestyle choice was successfully created.' }
        format.json { render :show, status: :created, location: @lifestyle_choice }
      else
        format.html { render :new }
        format.json { render json: @lifestyle_choice.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /lifestyle_choices/1
  # PATCH/PUT /lifestyle_choices/1.json
  def update
    respond_to do |format|
      if @lifestyle_choice.update(lifestyle_choice_params)
        format.html { redirect_to @lifestyle_choice, notice: 'Lifestyle choice was successfully updated.' }
        format.json { render :show, status: :ok, location: @lifestyle_choice }
      else
        format.html { render :edit }
        format.json { render json: @lifestyle_choice.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /lifestyle_choices/1
  # DELETE /lifestyle_choices/1.json
  def destroy
    @lifestyle_choice.destroy
    respond_to do |format|
      format.html { redirect_to lifestyle_choices_url, notice: 'Lifestyle choice was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_lifestyle_choice
    @lifestyle_choice = LifestyleChoice.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def lifestyle_choice_params
    params.require(:lifestyle_choice).permit(:name, :category, :version, :co2)
  end
end
